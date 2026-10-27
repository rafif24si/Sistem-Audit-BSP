<?php

namespace App\Services;

class CaptchaService
{
    /**
     * Generate a new math captcha challenge and store the answer in session.
     */
    public static function generate(): string
    {
        $num1 = rand(1, 15);
        $num2 = rand(1, 10);
        $answer = $num1 + $num2;

        session(['captcha_answer' => $answer]);

        return "{$num1} + {$num2} = ?";
    }

    /**
     * Validate the given answer against session.
     */
    public static function validate(mixed $value): bool
    {
        $expected = session('captcha_answer');

        if ($expected === null) {
            return false;
        }

        return (int) $value === (int) $expected;
    }
}
