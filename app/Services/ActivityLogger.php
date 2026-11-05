<?php

namespace App\Services;

use App\Models\ActivityLog;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Request;

class ActivityLogger
{
    /**
     * Log a user or system activity.
     */
    public static function log(
        string $action,
        string $description,
        ?int $userId = null,
        ?array $oldValues = null,
        ?array $newValues = null
    ): ActivityLog {
        return ActivityLog::create([
            'user_id' => $userId ?? Auth::id(),
            'action' => $action,
            'description' => $description,
            'old_values' => $oldValues,
            'new_values' => $newValues,
            'ip_address' => Request::ip(),
            'created_at' => now(),
        ]);
    }

    /**
     * Helper to log activity with old and new values clearly.
     */
    public static function logChange(
        string $action,
        string $description,
        ?array $oldValues = null,
        ?array $newValues = null,
        ?int $userId = null
    ): ActivityLog {
        return self::log($action, $description, $userId, $oldValues, $newValues);
    }
}
