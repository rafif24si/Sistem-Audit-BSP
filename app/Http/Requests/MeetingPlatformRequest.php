<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class MeetingPlatformRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()?->role === 'super_admin';
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $platformId = $this->route('meeting_platform')?->id ?? $this->route('meeting_platform');

        return [
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('meeting_platforms', 'name')
                    ->ignore($platformId)
                    ->whereNull('deleted_at'),
            ],
            'is_active' => [
                'nullable',
                'boolean',
            ],
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Nama platform meeting online wajib diisi.',
            'name.unique' => 'Nama platform ini sudah terdaftar.',
            'is_active.boolean' => 'Status aktif harus bernilai boolean.',
        ];
    }
}

