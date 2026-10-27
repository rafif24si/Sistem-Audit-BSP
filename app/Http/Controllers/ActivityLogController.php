<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ActivityLogController extends Controller
{
    /**
     * Display a listing of system audit trail activity logs.
     */
    public function index(Request $request): Response
    {
        $search = $request->input('search');
        $action = $request->input('action');

        $query = ActivityLog::with('user:id,name,email,role');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('action', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhere('ip_address', 'like', "%{$search}%")
                    ->orWhereHas('user', function ($uq) use ($search) {
                        $uq->where('name', 'like', "%{$search}%")
                            ->orWhere('email', 'like', "%{$search}%");
                    });
            });
        }

        if ($action) {
            $query->where('action', $action);
        }

        $logs = $query->latest('created_at')->paginate(15)->withQueryString();

        $actionTypes = ActivityLog::select('action')->distinct()->pluck('action');

        return Inertia::render('ActivityLogs/Index', [
            'logs' => $logs,
            'actionTypes' => $actionTypes,
            'filters' => [
                'search' => $search,
                'action' => $action,
            ],
        ]);
    }
}
