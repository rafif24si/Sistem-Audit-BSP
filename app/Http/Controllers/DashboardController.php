<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use App\Models\Kpi;
use App\Models\KpiCategory;
use App\Models\KpiPeriod;
use App\Models\Letter;
use App\Models\MasterDocument;
use App\Models\Meeting;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Display the main integrated audit dashboard.
     */
    public function index(Request $request): Response
    {
        $today = Carbon::today();

        // 1. KPI Statistics
        $totalControlledDocuments = MasterDocument::where('control_status', 'TERKENDALI')->count();
        $totalPendingDispositions = Letter::where('direction', 'incoming')->doesntHave('dispositions')->count();
        $totalPendingFollowups = Letter::where('scope', 'external')->whereIn('followup_status', ['pending', 'in_progress'])->count();
        $totalUpcomingMeetings = Meeting::where('status', 'Terjadwal')->where('meeting_date_start', '>=', $today)->count();

        // 2. Upcoming Audit Meetings
        $upcomingMeetings = Meeting::where('meeting_date_start', '>=', $today)
            ->where('status', 'Terjadwal')
            ->orderBy('meeting_date_start')
            ->orderBy('start_time')
            ->limit(4)
            ->get(['id', 'title', 'meeting_type', 'meeting_date_start', 'meeting_date_end', 'start_time', 'location', 'confidentiality', 'status']);

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

        // 5. Flexible Key Performance Indicators (KPIs)
        $kpiPeriods = KpiPeriod::orderByDesc('year')->get(['id', 'year', 'is_active']);
        $activePeriod = $kpiPeriods->firstWhere('is_active', true) ?? $kpiPeriods->first();

        $selectedPeriodId = $request->input('kpi_period_id');
        if ($selectedPeriodId === null && $activePeriod) {
            $selectedPeriodId = (string) $activePeriod->id;
        }

        $kpisQuery = Kpi::with(['creator:id,name', 'kpiPeriod:id,year'])
            ->orderBy('order_index')
            ->latest('updated_at');

        if ($selectedPeriodId) {
            $kpisQuery->where('kpi_period_id', $selectedPeriodId);
        }

        $kpis = $kpisQuery->get();
        $kpiCategories = KpiCategory::orderBy('name')->get(['id', 'name']);

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
            'kpis' => $kpis,
            'kpiCategories' => $kpiCategories,
            'kpiPeriods' => $kpiPeriods,
            'selectedPeriodId' => $selectedPeriodId ? (int) $selectedPeriodId : null,
        ]);
    }
}
