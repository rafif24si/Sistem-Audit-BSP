<?php

namespace App\Http\Controllers;

use App\Http\Requests\KpiPeriodRequest;
use App\Models\KpiPeriod;
use App\Services\ActivityLogger;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class KpiPeriodController extends Controller
{
    /**
     * Display a listing of KPI periods.
     */
    public function index(Request $request): Response
    {
        if (Auth::user()?->role !== 'super_admin') {
            abort(403, 'Akses Ditolak: Hanya Super Admin yang berhak mengelola data master periode KPI.');
        }

        $search = $request->input('search');

        $query = KpiPeriod::withCount('kpis');

        if ($search) {
            $query->where('year', 'like', "%{$search}%");
        }

        $kpiPeriods = $query->orderByDesc('year')->paginate(10)->withQueryString();

        return Inertia::render('MasterData/KpiPeriods/Index', [
            'kpiPeriods' => $kpiPeriods,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    /**
     * Store a newly created KPI period.
     */
    public function store(KpiPeriodRequest $request): RedirectResponse
    {
        if (Auth::user()?->role !== 'super_admin') {
            abort(403, 'Akses Ditolak.');
        }

        $data = $request->validated();
        $data['is_active'] = $request->boolean('is_active', true);
        $period = KpiPeriod::create($data);

        ActivityLogger::log(
            'CREATE_KPI_PERIOD',
            "Menambahkan master periode KPI: {$period->year}"
        );

        return redirect()->route('kpi-periods.index')
            ->with('success', "Periode KPI '{$period->year}' berhasil ditambahkan.");
    }

    /**
     * Update the specified KPI period.
     */
    public function update(KpiPeriodRequest $request, KpiPeriod $kpiPeriod): RedirectResponse
    {
        if (Auth::user()?->role !== 'super_admin') {
            abort(403, 'Akses Ditolak.');
        }

        $data = $request->validated();
        if ($request->has('is_active')) {
            $data['is_active'] = $request->boolean('is_active');
        }
        $kpiPeriod->update($data);

        ActivityLogger::log(
            'UPDATE_KPI_PERIOD',
            "Memperbarui master periode KPI: {$kpiPeriod->year}"
        );

        return redirect()->back()
            ->with('success', "Periode KPI '{$kpiPeriod->year}' berhasil diperbarui.");
    }

    /**
     * Remove the specified KPI period (Soft Delete).
     */
    public function destroy(KpiPeriod $kpiPeriod): RedirectResponse
    {
        if (Auth::user()?->role !== 'super_admin') {
            abort(403, 'Akses Ditolak.');
        }

        $year = $kpiPeriod->year;
        $kpiPeriod->delete();

        ActivityLogger::log(
            'DELETE_KPI_PERIOD',
            "Menghapus master periode KPI: {$year}"
        );

        return redirect()->back()
            ->with('success', "Periode KPI '{$year}' berhasil dihapus.");
    }
}

