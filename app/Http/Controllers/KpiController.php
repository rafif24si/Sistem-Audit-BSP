<?php

namespace App\Http\Controllers;

use App\Http\Requests\KpiRequest;
use App\Models\Kpi;
use App\Services\ActivityLogger;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Symfony\Component\HttpFoundation\StreamedResponse;

class KpiController extends Controller
{
    /**
     * Determine if current user can manage KPIs.
     */
    protected function canManageKpis(): bool
    {
        $user = Auth::user();
        if (! $user) {
            return false;
        }

        if (in_array($user->role, ['super_admin', 'manager_spi']) || $user->is_pjs) {
            return true;
        }

        return $user->hasPermission('kpis.manage');
    }

    /**
     * Store a newly created KPI record.
     */
    public function store(KpiRequest $request): RedirectResponse
    {
        if (! $this->canManageKpis()) {
            abort(403, 'Akses Ditolak: Anda tidak memiliki wewenang untuk menambahkan indikator kinerja.');
        }

        $data = $request->validated();
        unset($data['evidence']);

        if ($request->hasFile('evidence')) {
            $file = $request->file('evidence');
            $safeTitle = Str::slug($data['title']);
            $ext = $file->getClientOriginalExtension();
            $fileName = "kpi_{$safeTitle}_" . time() . ".{$ext}";
            $path = $file->storeAs('private/kpis', $fileName, 'local');
            $data['evidence_path'] = $path;
        }

        $data['created_by'] = Auth::id();
        $data['updated_by'] = Auth::id();

        $kpi = Kpi::create($data);

        $periodYear = $kpi->kpiPeriod?->year ?? '-';
        ActivityLogger::log(
            'CREATE_KPI',
            "Menambahkan target KPI baru: {$kpi->title} (Target: {$kpi->target_value} {$kpi->unit}, Polarisasi: {$kpi->polarity}, Periode Tahun: {$periodYear})"
        );

        return redirect()->back()->with('success', "Indikator kinerja '{$kpi->title}' berhasil ditambahkan.");
    }

    /**
     * Update the specified KPI record.
     */
    public function update(KpiRequest $request, Kpi $kpi): RedirectResponse
    {
        if (! $this->canManageKpis()) {
            abort(403, 'Akses Ditolak: Anda tidak memiliki wewenang untuk mengubah data indikator kinerja.');
        }

        $oldValues = $kpi->only([
            'title', 'category', 'target_value', 'realization_value', 'unit',
            'kpi_period_id', 'polarity', 'status', 'notes', 'evidence_path',
        ]);

        $data = $request->validated();
        unset($data['evidence']);

        if ($request->hasFile('evidence')) {
            $file = $request->file('evidence');
            $safeTitle = Str::slug($data['title']);
            $ext = $file->getClientOriginalExtension();
            $fileName = "kpi_{$safeTitle}_" . time() . ".{$ext}";
            $path = $file->storeAs('private/kpis', $fileName, 'local');
            $data['evidence_path'] = $path;
        }

        $data['updated_by'] = Auth::id();
        $kpi->update($data);

        $newValues = $kpi->only([
            'title', 'category', 'target_value', 'realization_value', 'unit',
            'kpi_period_id', 'polarity', 'status', 'notes', 'evidence_path',
        ]);

        ActivityLogger::logChange(
            'UPDATE_KPI',
            "Memperbarui parameter KPI: {$kpi->title} (Status: {$kpi->status})",
            $oldValues,
            $newValues
        );

        return redirect()->back()->with('success', "Indikator kinerja '{$kpi->title}' berhasil diperbarui.");
    }

    /**
     * Quick progress update with evidence upload.
     */
    public function updateProgress(Request $request, Kpi $kpi): RedirectResponse
    {
        if (! $this->canManageKpis()) {
            abort(403, 'Akses Ditolak: Anda tidak memiliki wewenang untuk memperbarui progres capaian KPI.');
        }

        $validated = $request->validate([
            'realization_value' => ['required', 'numeric', 'min:0'],
            'status' => [
                'required',
                Rule::in(['Tercapai', 'Dalam Proses', 'Perlu Perhatian', 'Belum Tercapai']),
            ],
            'notes' => ['nullable', 'string', 'max:1000'],
            'evidence' => ['nullable', 'file', 'mimes:pdf,doc,docx,xls,xlsx,jpg,png', 'max:10240'],
        ]);

        $oldValues = [
            'realization_value' => $kpi->realization_value,
            'status' => $kpi->status,
            'notes' => $kpi->notes,
            'evidence_path' => $kpi->evidence_path,
        ];

        $updateData = [
            'realization_value' => $validated['realization_value'],
            'status' => $validated['status'],
            'notes' => $validated['notes'] ?? $kpi->notes,
            'updated_by' => Auth::id(),
        ];

        if ($request->hasFile('evidence')) {
            $file = $request->file('evidence');
            $safeTitle = Str::slug($kpi->title);
            $ext = $file->getClientOriginalExtension();
            $fileName = "kpi_bukti_{$safeTitle}_" . time() . ".{$ext}";
            $path = $file->storeAs('private/kpis', $fileName, 'local');
            $updateData['evidence_path'] = $path;
        }

        $kpi->update($updateData);

        $newValues = [
            'realization_value' => $kpi->realization_value,
            'status' => $kpi->status,
            'notes' => $kpi->notes,
            'evidence_path' => $kpi->evidence_path,
        ];

        ActivityLogger::logChange(
            'UPDATE_KPI_PROGRESS',
            "Memperbarui progres capaian KPI: {$kpi->title} -> {$kpi->realization_value} {$kpi->unit} ({$kpi->achievement_percentage}%)",
            $oldValues,
            $newValues
        );

        return redirect()->back()->with('success', "Capaian progres KPI '{$kpi->title}' berhasil disimpan.");
    }

    /**
     * Download KPI evidence / verification file.
     */
    public function downloadEvidence(Kpi $kpi): StreamedResponse
    {
        if (! Auth::check()) {
            abort(401, 'Silakan login terlebih dahulu.');
        }

        if (! $kpi->evidence_path || ! Storage::disk('local')->exists($kpi->evidence_path)) {
            abort(404, 'Berkas bukti kinerja KPI tidak ditemukan di server.');
        }

        ActivityLogger::log(
            'DOWNLOAD_KPI_EVIDENCE',
            "Mengunduh berkas bukti capaian KPI: {$kpi->title}"
        );

        return Storage::disk('local')->download($kpi->evidence_path, basename($kpi->evidence_path));
    }

    /**
     * Remove the specified KPI record (Soft Delete).
     */
    public function destroy(Kpi $kpi): RedirectResponse
    {
        if (! $this->canManageKpis()) {
            abort(403, 'Akses Ditolak: Anda tidak memiliki wewenang untuk menghapus indikator kinerja.');
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
