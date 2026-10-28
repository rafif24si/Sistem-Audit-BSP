<?php

namespace App\Http\Controllers;

use App\Http\Requests\MeetingMinutesRequest;
use App\Http\Requests\MeetingRequest;
use App\Models\Meeting;
use App\Models\User;
use App\Services\ActivityLogger;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class MeetingController extends Controller
{
    /**
     * Display a listing of scheduled and completed meetings.
     */
    public function index(Request $request): Response
    {
        $user = Auth::user();
        $search = $request->input('search');
        $status = $request->input('status');
        $meetingType = $request->input('meeting_type');

        $query = Meeting::with('creator');

        // Access filter: Auditee can only view meetings they are invited to or created
        if ($user->role === 'auditee') {
            $query->where(function ($q) use ($user) {
                $q->where('created_by', $user->id)
                    ->orWhereJsonContains('invitees', $user->name)
                    ->orWhereJsonContains('invitees', $user->email);
            });
        }

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('location', 'like', "%{$search}%")
                    ->orWhere('discussion_points', 'like', "%{$search}%");
            });
        }

        if ($status) {
            $query->where('status', $status);
        }

        if ($meetingType) {
            $query->where('meeting_type', $meetingType);
        }

        $meetings = $query->latest('meeting_date')->paginate(10)->withQueryString();

        $allUsers = User::with('department')
            ->orderBy('name')
            ->get(['id', 'name', 'email', 'role', 'department_id']);

        return Inertia::render('Meetings/Index', [
            'meetings' => $meetings,
            'allUsers' => $allUsers,
            'filters' => [
                'search' => $search,
                'status' => $status,
                'meeting_type' => $meetingType,
            ],
        ]);
    }

    /**
     * Display meeting details and E-Notulen form.
     */
    public function show(Meeting $meeting): Response
    {
        $user = Auth::user();

        // Enforce Meeting Security (Auditee access check)
        if ($user->role === 'auditee') {
            $invitees = is_array($meeting->invitees) ? $meeting->invitees : [];
            $isInvited = in_array($user->name, $invitees) || in_array($user->email, $invitees);
            $isCreator = $user->id === $meeting->created_by;

            if (! $isInvited && ! $isCreator) {
                abort(403, 'Akses Ditolak: Anda tidak terdaftar sebagai peserta dalam agenda rapat terbatas ini.');
            }
        }

        $meeting->load('creator');

        return Inertia::render('Meetings/Show', [
            'meeting' => $meeting,
            'canEditNotulen' => in_array($user->role, ['super_admin', 'manager_spi', 'auditor']),
        ]);
    }

    /**
     * Store a newly scheduled meeting.
     */
    public function store(MeetingRequest $request): RedirectResponse
    {
        if (! in_array(Auth::user()?->role, ['super_admin', 'manager_spi'])) {
            abort(403, 'Akses Ditolak: Hanya Manager SPI atau Super Admin yang berhak menjadwalkan rapat.');
        }

        $data = $request->validated();

        if ($request->hasFile('attachment')) {
            $file = $request->file('attachment');
            $safeTitle = Str::slug($data['title']);
            $ext = $file->getClientOriginalExtension();
            $fileName = "rapat_{$safeTitle}_" . time() . ".{$ext}";

            $path = $file->storeAs('private/meetings', $fileName, 'local');
            $data['attachment_path'] = $path;
        }

        $data['created_by'] = Auth::id();
        $meeting = Meeting::create($data);

        ActivityLogger::log(
            'CREATE_MEETING',
            "Menjadwalkan rapat: {$meeting->title} ({$meeting->meeting_type}) pada {$meeting->meeting_date}"
        );

        return redirect()->route('meetings.index')
            ->with('success', "Jadwal rapat '{$meeting->title}' berhasil diterbitkan.");
    }

    /**
     * Update meeting schedule and details.
     */
    public function update(MeetingRequest $request, Meeting $meeting): RedirectResponse
    {
        if (! in_array(Auth::user()?->role, ['super_admin', 'manager_spi'])) {
            abort(403, 'Akses Ditolak: Hanya Manager SPI atau Super Admin yang berhak memperbarui jadwal rapat.');
        }

        $data = $request->validated();

        if ($request->hasFile('attachment')) {
            $file = $request->file('attachment');
            $safeTitle = Str::slug($data['title']);
            $ext = $file->getClientOriginalExtension();
            $fileName = "rapat_{$safeTitle}_" . time() . ".{$ext}";

            $path = $file->storeAs('private/meetings', $fileName, 'local');
            $data['attachment_path'] = $path;
        }

        $meeting->update($data);

        ActivityLogger::log(
            'UPDATE_MEETING',
            "Memperbarui agenda rapat: {$meeting->title}"
        );

        return redirect()->back()
            ->with('success', "Agenda rapat '{$meeting->title}' berhasil diperbarui.");
    }

    /**
     * Save E-Notulen (discussion points & decisions).
     */
    public function updateMinutes(MeetingMinutesRequest $request, Meeting $meeting): RedirectResponse
    {
        if (! in_array(Auth::user()?->role, ['super_admin', 'manager_spi', 'auditor'])) {
            abort(403, 'Akses Ditolak: Anda tidak memiliki wewenang untuk mengisi atau memperbarui E-Notulen.');
        }

        $data = $request->validated();

        $meeting->update($data);

        ActivityLogger::log(
            'UPDATE_NOTULEN',
            "Mencatat E-Notulen hasil rapat: {$meeting->title} (Status: {$data['status']})"
        );

        return redirect()->back()
            ->with('success', 'E-Notulen dan butir keputusan rapat berhasil disimpan.');
    }

    /**
     * Remove the specified meeting (Soft Delete).
     */
    public function destroy(Meeting $meeting): RedirectResponse
    {
        if (! in_array(Auth::user()?->role, ['super_admin', 'manager_spi'])) {
            abort(403, 'Akses Ditolak: Hanya Manager SPI atau Super Admin yang berhak menghapus agenda rapat.');
        }

        $title = $meeting->title;
        $meeting->delete();

        ActivityLogger::log(
            'DELETE_MEETING',
            "Menghapus (soft delete) agenda rapat: {$title}"
        );

        return redirect()->route('meetings.index')
            ->with('success', "Agenda rapat '{$title}' berhasil dihapus.");
    }

    /**
     * Download meeting material or attendance sheet attachment.
     */
    public function downloadAttachment(Meeting $meeting): StreamedResponse
    {
        $user = Auth::user();

        if ($user->role === 'auditee') {
            $invitees = is_array($meeting->invitees) ? $meeting->invitees : [];
            $isInvited = in_array($user->name, $invitees) || in_array($user->email, $invitees);

            if (! $isInvited && $user->id !== $meeting->created_by) {
                abort(403, 'Akses Ditolak: Anda tidak memiliki izin untuk mengunduh lampiran rapat ini.');
            }
        }

        if (! $meeting->attachment_path || ! Storage::disk('local')->exists($meeting->attachment_path)) {
            abort(404, 'Berkas lampiran rapat tidak ditemukan di server.');
        }

        ActivityLogger::log(
            'DOWNLOAD_MEETING_ATTACHMENT',
            "Mengunduh lampiran materi/notulen rapat: {$meeting->title}"
        );

        return Storage::disk('local')->download($meeting->attachment_path, basename($meeting->attachment_path));
    }
}
