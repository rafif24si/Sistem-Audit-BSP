<?php

namespace App\Http\Requests\Auth;

use App\Services\CaptchaService;
use Illuminate\Auth\Events\Lockout;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class LoginRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'email' => ['required', 'string', 'email'],
            'password' => ['required', 'string'],
        ];
    }

    /**
     * Configure the validator instance with Cloudflare Turnstile verification.
     */
    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            $token = $this->input('cf_turnstile_response') ?? $this->input('cf-turnstile-response');

            if (! $token) {
                $errorMessage = 'Validasi keamanan (Captcha) wajib diselesaikan.';
                $validator->errors()->add('cf_turnstile_response', $errorMessage);
                $validator->errors()->add('cf-turnstile-response', $errorMessage);
                return;
            }

            $secret = config('services.turnstile.secret') ?: env('TURNSTILE_SECRET_KEY');

            try {
                $httpClient = app()->isLocal() ? Http::withoutVerifying() : Http::asForm();
                $response = $httpClient->asForm()->timeout(10)->post('https://challenges.cloudflare.com/turnstile/v0/siteverify', [
                    'secret' => $secret,
                    'response' => $token,
                    'remoteip' => $this->ip(),
                ]);

                $result = $response->json();

                if (! ($result['success'] ?? false)) {
                    \Illuminate\Support\Facades\Log::warning('Turnstile verification failed', [
                        'result' => $result,
                        'ip' => $this->ip(),
                    ]);
                    $errorMessage = 'Validasi keamanan (Captcha) gagal. Silakan coba lagi.';
                    $validator->errors()->add('cf_turnstile_response', $errorMessage);
                    $validator->errors()->add('cf-turnstile-response', $errorMessage);
                }
            } catch (\Throwable $e) {
                \Illuminate\Support\Facades\Log::error('Turnstile connection error: ' . $e->getMessage());
                $errorMessage = 'Validasi keamanan (Captcha) gagal. Silakan coba lagi.';
                $validator->errors()->add('cf_turnstile_response', $errorMessage);
                $validator->errors()->add('cf-turnstile-response', $errorMessage);
            }
        });
    }

    /**
     * Attempt to authenticate the request's credentials.
     *
     * @throws ValidationException
     */
    public function authenticate(): void
    {
        $this->ensureIsNotRateLimited();

        if (! Auth::attempt($this->only('email', 'password'), $this->boolean('remember'))) {
            RateLimiter::hit($this->throttleKey());

            throw ValidationException::withMessages([
                'email' => trans('auth.failed'),
            ]);
        }

        RateLimiter::clear($this->throttleKey());
        session()->forget('captcha_answer');
    }

    /**
     * Ensure the login request is not rate limited.
     *
     * @throws ValidationException
     */
    public function ensureIsNotRateLimited(): void
    {
        if (! RateLimiter::tooManyAttempts($this->throttleKey(), 5)) {
            return;
        }

        event(new Lockout($this));

        $seconds = RateLimiter::availableIn($this->throttleKey());

        throw ValidationException::withMessages([
            'email' => trans('auth.throttle', [
                'seconds' => $seconds,
                'minutes' => ceil($seconds / 60),
            ]),
        ]);
    }

    /**
     * Get the rate limiting throttle key for the request.
     */
    public function throttleKey(): string
    {
        return Str::transliterate(Str::lower($this->string('email')).'|'.$this->ip());
    }
}
