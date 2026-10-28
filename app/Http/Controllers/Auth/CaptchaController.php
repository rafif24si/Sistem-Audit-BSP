<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Services\CaptchaService;
use Illuminate\Http\JsonResponse;

class CaptchaController extends Controller
{
    /**
     * Refresh and return a new captcha image and key.
     */
    public function refresh(): JsonResponse
    {
        $captcha = CaptchaService::generateApi();

        return response()->json([
            'img' => $captcha['img'],
            'key' => $captcha['key'],
        ]);
    }
}
