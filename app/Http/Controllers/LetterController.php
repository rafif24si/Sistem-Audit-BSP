<?php

namespace App\Http\Controllers;

use App\Http\Requests\LetterRequest;
use App\Http\Requests\UpdateFollowUpRequest;
use App\Models\Letter;
use App\Services\ActivityLogger;
use App\Services\DocumentNumberService;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class LetterController extends Controller
{
    /**
     * Display Internal Letters page.
     */
    public function internal(Request $request): Response
    {
        $direction = $request->input('direction');
        $search = $request->input('search');
        $confidentiality = $request->input('confidentiality');
        $letterTypeCode = $request->input('letter_type_code');

        $query = Letter::with('creator')->where('scope', 'internal');

        if ($direction) {
            $query->where('direction', $direction);
        }

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('subject', 'like', "%{$search}%")
                    ->orWhere('letter_number', 'like', "%{$search}%")
                    ->orWhere('sender', 'like', "%{$search}%")
                    ->orWhere('recipient', 'like', "%{$search}%");
            });
        }

        if ($confidentiality) {
            $query->where('confidentiality', $confidentiality);
        }

        if ($letterTypeCode) {
            $query->where('letter_type_code', $letterTypeCode);
        }

        $letters = $query->latest('letter_date')->paginate(10)->withQueryString();

        return Inertia::render('Letters/Internal', [
            'letters' => $letters,
            'filters' => [
                'direction' => $direction,
                'search' => $search,
                'confidentiality' => $confidentiality,
                'letter_type_code' => $letterTypeCode,
            ],
        ]);
    }

    /**
     * Display External Letters page.
     */
    public function external(Request $request): Response
    {
        $direction = $request->input('direction');
        $search = $request->input('search');
        $followupStatus = $request->input('followup_status');
        $confidentiality = $request->input('confidentiality');

        $query = Letter::with('creator')->where('scope', 'external');

        if ($direction) {
            $query->where('direction', $direction);
        }

        if ($followupStatus) {
            $query->where('followup_status', $followupStatus);
        }

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('subject', 'like', "%{$search}%")
                    ->orWhere('letter_number', 'like', "%{$search}%")
                    ->orWhere('sender', 'like', "%{$search}%")
                    ->orWhere('recipient', 'like', "%{$search}%");
            });
        }

        if ($confidentiality) {
            $query->where('confidentiality', $confidentiality);
        }

        $letters = $query->latest('letter_date')->paginate(10)->withQueryString();

        return Inertia::render('Letters/External', [
            'letters' => $letters,
            'filters' => [
                'direction' => $direction,
                'search' => $search,
                'followup_status' => $followupStatus,
                'confidentiality' => $confidentiality,
            ],
        ]);
    }

    /**
     * Generate automatic letter number for outgoing letters.
     */
    public function generateNumber(Request $request): JsonResponse
    {
        $typeCode = (string) $request->input('letter_type_code', 'ST');
        $dateStr = $request->input('letter_date');
        $date = $dateStr ? Carbon::parse($dateStr) : Carbon::now();

        $number = DocumentNumberService::generateLetterNumber($typeCode, $date);

        return response()->json(['letter_number' => $number]);
    }

    /**
     * Store a newly created letter.
     */
    public function store(LetterRequest $request): RedirectResponse
    {
        $data = $request->validated();

        if ($request->hasFile('file')) {
            $file = $request->file('file');
            $safeNumber = Str::slug($data['letter_number']);
            $extension = $file->getClientOriginalExtension();
            $fileName = "surat_{$safeNumber}." . $extension;

            $path = $file->storeAs('private/letters', $fileName, 'local');
            $data['file_path'] = $path;
        }

        $data['created_by'] = Auth::id();
        $letter = Letter::create($data);

        ActivityLogger::log(
            'CREATE_LETTER',
            "Mencatat surat {$letter->scope} ({$letter->direction}): {$letter->letter_number} - {$letter->subject}"
        );

        $redirectRoute = $letter->scope === 'external' ? 'letters.external' : 'letters.internal';
        return redirect()->route($redirectRoute)
            ->with('success', "Surat {$letter->letter_number} berhasil disimpan.");
    }

    /**
     * Update the specified letter.
     */
    public function update(LetterRequest $request, Letter $letter): RedirectResponse
    {
        $data = $request->validated();

        if ($request->hasFile('file')) {
            $file = $request->file('file');
            $safeNumber = Str::slug($data['letter_number']);
            $extension = $file->getClientOriginalExtension();
            $fileName = "surat_{$safeNumber}." . $extension;

            $path = $file->storeAs('private/letters', $fileName, 'local');
            $data['file_path'] = $path;
        }

        $letter->update($data);

        ActivityLogger::log(
            'UPDATE_LETTER',
            "Memperbarui data surat: {$letter->letter_number}"
        );

        return redirect()->back()
            ->with('success', "Surat {$letter->letter_number} berhasil diperbarui.");
    }

    /**
     * Update Follow-up status for external letter.
     */
    public function updateFollowUp(UpdateFollowUpRequest $request, Letter $letter): RedirectResponse
    {
        $data = $request->validated();

        $letter->update($data);

        ActivityLogger::log(
            'UPDATE_LETTER_FOLLOWUP',
            "Memperbarui status tindak lanjut surat eksternal {$letter->letter_number} menjadi {$data['followup_status']}"
        );

        return redirect()->back()
            ->with('success', "Status tindak lanjut surat {$letter->letter_number} berhasil diperbarui.");
    }

    /**
     * Remove the specified letter (Soft Delete).
     */
    public function destroy(Letter $letter): RedirectResponse
    {
        $num = $letter->letter_number;
        $letter->delete();

        ActivityLogger::log(
            'DELETE_LETTER',
            "Menghapus (soft delete) surat: {$num}"
        );

        return redirect()->back()
            ->with('success', "Surat {$num} berhasil dihapus.");
    }

    /**
     * Download letter attachment.
     */
    public function download(Letter $letter): StreamedResponse
    {
        $user = Auth::user();

        if (in_array($letter->confidentiality, ['Rahasia', 'Sangat Rahasia'])) {
            $hasSpecialRole = in_array($user->role, ['super_admin', 'manager_spi', 'auditor']);
            $isCreator = $user->id === $letter->created_by;

            if (! $hasSpecialRole && ! $isCreator) {
                abort(403, 'Akses Ditolak: Anda tidak memiliki izin untuk mengunduh lampiran surat rahasia ini.');
            }
        }

        if (! $letter->file_path || ! Storage::disk('local')->exists($letter->file_path)) {
            abort(404, 'Lampiran surat tidak ditemukan di server.');
        }

        ActivityLogger::log(
            'DOWNLOAD_LETTER_ATTACHMENT',
            "Mengunduh lampiran file surat: {$letter->letter_number}"
        );

        return Storage::disk('local')->download($letter->file_path, basename($letter->file_path));
    }
}
