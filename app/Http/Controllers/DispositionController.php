<?php

namespace App\Http\Controllers;

use App\Http\Requests\DispositionCompletionRequest;
use App\Http\Requests\DispositionRequest;
use App\Models\Disposition;
use App\Models\Letter;
use App\Models\User;
use App\Services\ActivityLogger;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class DispositionController extends Controller
{
    /**
     * Display a listing of dispositions.
     */
    public function index(Request $request): Response
    {
        $user = Auth::user();
        $defaultTab = in_array($user->role, ['super_admin', 'manager_spi']) ? 'all' : 'received';
        $tab = $request->input('tab', $defaultTab);

        $search = $request->input('search');
        $urgency = $request->input('urgency');
        $status = $request->input('status');

        $query = Disposition::with(['letter', 'sender', 'recipient']);

        if ($tab === 'received') {
            $query->where('to_user_id', $user->id);
        } elseif ($tab === 'given') {
            $query->where('from_user_id', $user->id);
        }

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->whereHas('letter', function ($lq) use ($search) {
                    $lq->where('subject', 'like', "%{$search}%")
                        ->orWhere('letter_number', 'like', "%{$search}%");
                })
                ->orWhereHas('recipient', function ($uq) use ($search) {
                    $uq->where('name', 'like', "%{$search}%");
                })
                ->orWhereHas('sender', function ($uq) use ($search) {
                    $uq->where('name', 'like', "%{$search}%");
                })
                ->orWhere('notes', 'like', "%{$search}%")
                ->orWhere('completion_notes', 'like', "%{$search}%");
            });
        }

        if ($urgency) {
            $query->where('urgency', $urgency);
        }

        if ($status) {
            $query->where('status', $status);
        }

        $dispositions = $query->latest('due_date')->paginate(10)->withQueryString();

        // Get letters that can receive dispositions (incoming letters or letters without complete disposition)
        $incomingLetters = Letter::where('direction', 'incoming')
            ->latest('letter_date')
            ->limit(30)
            ->get(['id', 'letter_number', 'subject', 'sender', 'letter_date']);

        // Get potential disposition recipients
        $staffUsers = User::with('department')
            ->whereIn('role', ['manager_spi', 'auditor', 'auditee'])
            ->orderBy('name')
            ->get(['id', 'name', 'role', 'department_id']);

        return Inertia::render('Dispositions/Index', [
            'dispositions' => $dispositions,
            'incomingLetters' => $incomingLetters,
            'staffUsers' => $staffUsers,
            'filters' => [
                'tab' => $tab,
                'search' => $search,
                'urgency' => $urgency,
                'status' => $status,
            ],
        ]);
    }

    /**
     * Store a newly created disposition.
     */
    public function store(DispositionRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $data['from_user_id'] = Auth::id();
        $data['status'] = 'pending';

        $disposition = Disposition::create($data);

        $letter = Letter::find($data['letter_id']);
        $recipient = User::find($data['to_user_id']);

        ActivityLogger::log(
            'CREATE_DISPOSITION',
            "Memberikan disposisi instruksi '{$disposition->instruction}' pada surat {$letter?->letter_number} kepada {$recipient?->name}"
        );

        return redirect()->route('dispositions.index')
            ->with('success', 'Lembar instruksi disposisi berhasil diterbitkan.');
    }

    /**
     * Update the specified disposition details.
     */
    public function update(DispositionRequest $request, Disposition $disposition): RedirectResponse
    {
        $data = $request->validated();
        $disposition->update($data);

        ActivityLogger::log(
            'UPDATE_DISPOSITION',
            "Memperbarui arahan disposisi pada surat {$disposition->letter?->letter_number}"
        );

        return redirect()->back()
            ->with('success', 'Arahan lembar disposisi berhasil diperbarui.');
    }

    /**
     * Update disposition completion status and notes.
     */
    public function updateStatus(DispositionCompletionRequest $request, Disposition $disposition): RedirectResponse
    {
        $data = $request->validated();

        if ($data['status'] === 'completed' && ! $disposition->completed_at) {
            $data['completed_at'] = Carbon::now();
        } elseif ($data['status'] !== 'completed') {
            $data['completed_at'] = null;
        }

        $disposition->update($data);

        ActivityLogger::log(
            'UPDATE_DISPOSITION_STATUS',
            "Memperbarui status penyelesaian disposisi surat {$disposition->letter?->letter_number} menjadi {$data['status']}"
        );

        return redirect()->back()
            ->with('success', 'Status tindak lanjut disposisi berhasil diperbarui.');
    }

    /**
     * Remove the specified disposition (Soft Delete).
     */
    public function destroy(Disposition $disposition): RedirectResponse
    {
        $letterNum = $disposition->letter?->letter_number;
        $disposition->delete();

        ActivityLogger::log(
            'DELETE_DISPOSITION',
            "Menghapus (soft delete) lembar disposisi surat: {$letterNum}"
        );

        return redirect()->back()
            ->with('success', 'Lembar disposisi berhasil dihapus.');
    }
}
