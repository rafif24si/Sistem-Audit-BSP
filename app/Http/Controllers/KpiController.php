<?php

namespace App\Http\Controllers;

use App\Http\Requests\KpiRequest;
use App\Models\Kpi;
use App\Services\ActivityLogger;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;

class KpiController extends Controller
{
    /**
     * Store a newly created KPI record.
     */
    public function store(KpiRequest $request): RedirectResponse
    {
        if (! in_array(Auth::user()?->role, ['super_admin', 'manager_spi'])) {
            abort(403, 'Akses Ditolak: Hanya Manager SPI atau Super Admin yang berhak menambahkan indikator kinerja.');
        }

        $data = $request->validated();
        $data['created_by'] = Auth::id();
        $data['updated_by'] = Auth::id();

        $kpi = Kpi::create($data);

        ActivityLogger::log(
            'CREATE_KPI',
            "Menambahkan target KPI baru: {$kpi->title} (Target: {$kpi->target_value}{$kpi->unit}, Periode: {$kpi->period})"
        );

        return redirect()->back()->with('success', "Indikator kinerja '{$kpi->title}' berhasil ditambahkan.");
    }

    /**
     * Update the specified KPI record.
     */
    public function update(KpiRequest $request, Kpi $kpi): RedirectResponse
    {
        if (! in_array(Auth::user()?->role, ['super_admin', 'manager_spi'])) {
            abort(403, 'Akses Ditolak: Hanya Manager SPI atau Super Admin yang berhak mengubah data indikator kinerja.');
        }

        $data = $request->validated();
        $data['updated_by'] = Auth::id();

        $kpi->update($data);

        ActivityLogger::log(
            'UPDATE_KPI',
            "Memperbarui realisasi KPI: {$kpi->title} (Realisasi: {$kpi->realization_value}{$kpi->unit}, Status: {$kpi->status})"
        );

        return redirect()->back()->with('success', "Indikator kinerja '{$kpi->title}' berhasil diperbarui.");
    }

    /**
     * Remove the specified KPI record (Soft Delete).
     */
    public function destroy(Kpi $kpi): RedirectResponse
    {
        if (! in_array(Auth::user()?->role, ['super_admin', 'manager_spi'])) {
            abort(403, 'Akses Ditolak: Hanya Manager SPI atau Super Admin yang berhak menghapus indikator kinerja.');
        }

        $title = $kpi->title;
        $kpi->delete();

        ActivityLogger::log(
            'DELETE_KPI',
            "Menghapus (soft delete) indikator kinerja: {$title}"
        );

        return redirect()->back()->with('success', "Indikator kinerja '{$title}' berhasil dihapus.");
    }
}
