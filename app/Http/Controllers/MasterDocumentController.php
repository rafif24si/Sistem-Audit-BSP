<?php

namespace App\Http\Controllers;

use App\Http\Requests\MasterDocumentRequest;
use App\Models\Department;
use App\Models\MasterDocument;
use App\Services\ActivityLogger;
use App\Services\DocumentNumberService;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class MasterDocumentController extends Controller
{
    /**
     * Display a listing of master documents.
     */
    public function index(Request $request): Response
    {
        $tab = $request->input('tab', 'active');
        $search = $request->input('search');
        $departmentId = $request->input('department_id');
        $documentType = $request->input('document_type');
        $confidentiality = $request->input('confidentiality');

        $query = MasterDocument::with(['department', 'creator']);

        if ($tab === 'expired') {
            $query->where('control_status', 'KADALUARSA');
        } elseif ($tab === 'active') {
            $query->where('control_status', 'TERKENDALI');
        }

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('document_number', 'like', "%{$search}%");
            });
        }

        if ($departmentId) {
            $query->where('department_id', $departmentId);
        }

        if ($documentType) {
            $query->where('document_type', $documentType);
        }

        if ($confidentiality) {
            $query->where('confidentiality', $confidentiality);
        }

        $documents = $query->latest('effective_date')->paginate(10)->withQueryString();

        return Inertia::render('Documents/Index', [
            'documents' => $documents,
            'departments' => Department::orderBy('name')->get(['id', 'code', 'name']),
            'filters' => [
                'tab' => $tab,
                'search' => $search,
                'department_id' => $departmentId,
                'document_type' => $documentType,
                'confidentiality' => $confidentiality,
            ],
        ]);
    }

    /**
     * Generate document number preview.
     */
    public function generateNumber(Request $request)
    {
        $deptId = (int) $request->input('department_id');
        $type = (string) $request->input('document_type', 'SOP');

        $number = DocumentNumberService::generateMasterDocumentNumber($deptId, $type);

        return response()->json(['document_number' => $number]);
    }

    /**
     * Store a newly created master document.
     */
    public function store(MasterDocumentRequest $request): RedirectResponse
    {
        if (Auth::user()?->role !== 'super_admin') {
            abort(403, 'Akses Ditolak: Hanya Super Admin yang berhak menambahkan dokumen master.');
        }

        $data = $request->validated();
        $file = $request->file('file');

        // Clean document code for filename
        $safeCode = Str::slug($data['document_number']);
        $safeType = strtolower($data['document_type']);
        $safeVer = Str::slug($data['version']);
        $extension = $file->getClientOriginalExtension();
        $fileName = "{$safeCode}_{$safeType}_v{$safeVer}.{$extension}";

        // Store file in private local disk
        $path = $file->storeAs('private/documents', $fileName, 'local');
        $data['file_path'] = $path;
        $data['created_by'] = Auth::id();

        // Auto Status Control: If new document is TERKENDALI and an existing document shares the same document_number, archive older version
        if ($data['control_status'] === 'TERKENDALI') {
            $existing = MasterDocument::where('document_number', $data['document_number'])->first();
            if ($existing) {
                $archivedNumber = "{$existing->document_number}-v{$existing->version}";
                $existing->update([
                    'document_number' => $archivedNumber,
                    'control_status' => 'KADALUARSA',
                    'expired_date' => Carbon::now()->addYears(3),
                ]);

                ActivityLogger::log(
                    'ARCHIVE_SOP',
                    "Dokumen versi {$existing->version} dialihkan statusnya menjadi KADALUARSA dengan nomor arsip {$archivedNumber}"
                );
            }
        }

        $document = MasterDocument::create($data);

        ActivityLogger::log(
            'CREATE_MASTER_DOCUMENT',
            "Menambahkan dokumen master: {$document->document_number} ({$document->title}) versi {$document->version}"
        );

        return redirect()->route('documents.index')
            ->with('success', "Dokumen master {$document->document_number} berhasil disimpan.");
    }

    /**
     * Update the specified master document.
     */
    public function update(MasterDocumentRequest $request, MasterDocument $document): RedirectResponse
    {
        if (Auth::user()?->role !== 'super_admin') {
            abort(403, 'Akses Ditolak: Hanya Super Admin yang berhak memperbarui dokumen master.');
        }

        $data = $request->validated();

        if ($request->hasFile('file')) {
            $file = $request->file('file');
            $safeCode = Str::slug($data['document_number']);
            $safeType = strtolower($data['document_type']);
            $safeVer = Str::slug($data['version']);
            $extension = $file->getClientOriginalExtension();
            $fileName = "{$safeCode}_{$safeType}_v{$safeVer}.{$extension}";

            $path = $file->storeAs('private/documents', $fileName, 'local');
            $data['file_path'] = $path;
        }

        $document->update($data);

        ActivityLogger::log(
            'UPDATE_MASTER_DOCUMENT',
            "Memperbarui dokumen master: {$document->document_number} ({$document->title})"
        );

        return redirect()->back()
            ->with('success', "Dokumen master {$document->document_number} berhasil diperbarui.");
    }

    /**
     * Remove the specified master document (Soft Delete).
     */
    public function destroy(MasterDocument $document): RedirectResponse
    {
        if (Auth::user()?->role !== 'super_admin') {
            abort(403, 'Akses Ditolak: Hanya Super Admin yang berhak menghapus dokumen master.');
        }

        $docNumber = $document->document_number;
        $document->delete();

        ActivityLogger::log(
            'DELETE_MASTER_DOCUMENT',
            "Menghapus (soft delete) dokumen master: {$docNumber}"
        );

        return redirect()->back()
            ->with('success', "Dokumen master {$docNumber} berhasil dipindahkan ke arsip sampah.");
    }

    /**
     * Download or view document file with role & confidentiality verification.
     */
    public function download(MasterDocument $document): StreamedResponse
    {
        $user = Auth::user();

        // Access control for Rahasia and Sangat Rahasia
        if (in_array($document->confidentiality, ['Rahasia', 'Sangat Rahasia'])) {
            $hasSpecialRole = in_array($user->role, ['super_admin', 'manager_spi', 'auditor']);
            $isOwnerDepartment = $user->department_id === $document->department_id;

            if (! $hasSpecialRole && ! $isOwnerDepartment) {
                abort(403, 'Akses Ditolak: Anda tidak memiliki izin untuk mengunduh dokumen dengan klasifikasi kerahasiaan ini.');
            }
        }

        if (! Storage::disk('local')->exists($document->file_path)) {
            abort(404, 'File dokumen tidak ditemukan di penyimpanan server.');
        }

        ActivityLogger::log(
            'DOWNLOAD_MASTER_DOCUMENT',
            "Mengunduh file dokumen master: {$document->document_number}"
        );

        return Storage::disk('local')->download($document->file_path, basename($document->file_path));
    }
}
