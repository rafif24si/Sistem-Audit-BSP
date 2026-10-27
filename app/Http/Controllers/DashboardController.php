<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use App\Models\Letter;
use App\Models\MasterDocument;
use App\Models\Meeting;
use Carbon\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Display the main integrated audit dashboard.
     */
    public function index(): Response
    {
        $today = Carbon::today();

        // 1. KPI Statistics
        $totalControlledDocuments = MasterDocument::where('control_status', 'TERKENDALI')->count();
        $totalPendingDispositions = Letter::where('direction', 'incoming')->doesntHave('dispositions')->count();
        $totalPendingFollowups = Letter::where('scope', 'external')->whereIn('followup_status', ['pending', 'in_progress'])->count();
        $totalUpcomingMeetings = Meeting::whereIn('status', ['Terjadwal', 'Berlangsung'])->where('meeting_date', '>=', $today)->count();

        // 2. Upcoming Audit Meetings
        $upcomingMeetings = Meeting::where('meeting_date', '>=', $today)
            ->whereIn('status', ['Terjadwal', 'Berlangsung'])
            ->orderBy('meeting_date')
            ->orderBy('start_time')
            ->limit(4)
            ->get(['id', 'title', 'meeting_type', 'meeting_date', 'start_time', 'location', 'confidentiality', 'status']);

        // 3. Priority External Letters needing Follow-Up
        $pendingFollowups = Letter::where('scope', 'external')
            ->whereIn('followup_status', ['pending', 'in_progress'])
            ->latest('letter_date')
            ->limit(4)
            ->get(['id', 'letter_number', 'subject', 'sender', 'letter_date', 'followup_status', 'followup_due_date']);

        // 4. Recent System Activity Logs (Audit Trail)
        $recentActivities = ActivityLog::with('user:id,name,role')
            ->latest('created_at')
            ->limit(6)
            ->get();

        return Inertia::render('Dashboard', [
            'stats' => [
                'controlled_documents' => $totalControlledDocuments,
                'pending_dispositions' => $totalPendingDispositions,
                'pending_followups' => $totalPendingFollowups,
                'upcoming_meetings' => $totalUpcomingMeetings,
            ],
            'upcomingMeetings' => $upcomingMeetings,
            'pendingFollowups' => $pendingFollowups,
            'recentActivities' => $recentActivities,
        ]);
    }
}
