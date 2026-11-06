<?php

namespace App\Http\Controllers;

use App\Http\Requests\MeetingPlatformRequest;
use App\Models\MeetingPlatform;
use App\Services\ActivityLogger;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class MeetingPlatformController extends Controller
{
    /**
     * Display a listing of meeting platforms.
     */
    public function index(Request $request): Response
    {
        if (Auth::user()?->role !== 'super_admin') {
            abort(403, 'Akses Ditolak: Hanya Super Admin yang berhak mengelola data master platform meeting online.');
        }

        $search = $request->input('search');

        $query = MeetingPlatform::query();

        if ($search) {
            $query->where('name', 'like', "%{$search}%");
        }

        $meetingPlatforms = $query->orderBy('name')->paginate(10)->withQueryString();

        return Inertia::render('MasterData/MeetingPlatforms/Index', [
            'meetingPlatforms' => $meetingPlatforms,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    /**
     * Store a newly created meeting platform.
     */
    public function store(MeetingPlatformRequest $request): RedirectResponse
    {
        if (Auth::user()?->role !== 'super_admin') {
            abort(403, 'Akses Ditolak: Hanya Super Admin yang berhak menambah data master.');
        }

        $data = $request->validated();
        $data['is_active'] = $request->boolean('is_active', true);
        $platform = MeetingPlatform::create($data);

        ActivityLogger::log(
            'CREATE_MEETING_PLATFORM',
            "Menambahkan master platform meeting online: {$platform->name}"
        );

        return redirect()->route('meeting-platforms.index')
            ->with('success', "Platform meeting online '{$platform->name}' berhasil ditambahkan.");
    }

    /**
     * Update the specified meeting platform.
     */
    public function update(MeetingPlatformRequest $request, MeetingPlatform $meetingPlatform): RedirectResponse
    {
        if (Auth::user()?->role !== 'super_admin') {
            abort(403, 'Akses Ditolak: Hanya Super Admin yang berhak memperbarui data master.');
        }

        $data = $request->validated();
        if ($request->has('is_active')) {
            $data['is_active'] = $request->boolean('is_active');
        }
        $meetingPlatform->update($data);

        ActivityLogger::log(
            'UPDATE_MEETING_PLATFORM',
            "Memperbarui master platform meeting online: {$meetingPlatform->name}"
        );

        return redirect()->back()
            ->with('success', "Platform meeting online '{$meetingPlatform->name}' berhasil diperbarui.");
    }

    /**
     * Remove the specified meeting platform (Soft Delete).
     */
    public function destroy(MeetingPlatform $meetingPlatform): RedirectResponse
    {
        if (Auth::user()?->role !== 'super_admin') {
            abort(403, 'Akses Ditolak: Hanya Super Admin yang berhak menghapus data master.');
        }

        $name = $meetingPlatform->name;
        $meetingPlatform->delete();

        ActivityLogger::log(
            'DELETE_MEETING_PLATFORM',
            "Menghapus master platform meeting online: {$name}"
        );

        return redirect()->back()
            ->with('success', "Platform meeting online '{$name}' berhasil dihapus.");
    }
}

