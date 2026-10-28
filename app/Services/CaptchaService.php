<?php

namespace App\Services;

class CaptchaService
{
    /**
     * Generate a new image text captcha via mews/captcha API.
     *
     * @param string $config
     * @return array{img: string, key: string, sensitive: bool}
     */
    public static function generateApi(string $config = 'default'): array
    {
        $captcha = app('captcha')->create($config, true);

        return [
            'img' => $captcha['img'],
            'key' => $captcha['key'],
            'sensitive' => $captcha['sensitive'] ?? false,
        ];
    }

    /**
     * Validate the given captcha answer against the key or session.
     *
     * @param mixed $value
     * @param string|null $key
     * @param string $config
     * @return bool
     */
    public static function validate(mixed $value, ?string $key = null, string $config = 'default'): bool
    {
        if (empty($value)) {
            return false;
        }

        if (! empty($key)) {
            return app('captcha')->check_api((string) $value, $key, $config);
        }

        return app('captcha')->check((string) $value);
    }
}
