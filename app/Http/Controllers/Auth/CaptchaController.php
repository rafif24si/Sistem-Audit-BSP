<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Services\CaptchaService;
use Illuminate\Http\JsonResponse;

class CaptchaController extends Controller
{
    /**
     * Refresh and return a new captcha question.
     */
    public function refresh(): JsonResponse
    {
        $question = CaptchaService::generate();

        return response()->json([
            'question' => $question,
        ]);
    }
}
