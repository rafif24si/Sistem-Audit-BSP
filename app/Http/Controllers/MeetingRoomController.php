<?php

namespace App\Http\Controllers;

use App\Http\Requests\MeetingRoomRequest;
use App\Models\MeetingRoom;
use App\Services\ActivityLogger;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class MeetingRoomController extends Controller
{
    /**
     * Display a listing of meeting rooms.
     */
    public function index(Request $request): Response
    {
        if (Auth::user()?->role !== 'super_admin') {
            abort(403, 'Akses Ditolak: Hanya Super Admin yang berhak mengelola data master ruangan rapat.');
        }

        $search = $request->input('search');

        $query = MeetingRoom::query();

        if ($search) {
            $query->where('name', 'like', "%{$search}%");
        }

        $meetingRooms = $query->orderBy('name')->paginate(10)->withQueryString();

        return Inertia::render('MasterData/MeetingRooms/Index', [
            'meetingRooms' => $meetingRooms,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    /**
     * Store a newly created meeting room.
     */
    public function store(MeetingRoomRequest $request): RedirectResponse
    {
        if (Auth::user()?->role !== 'super_admin') {
            abort(403, 'Akses Ditolak: Hanya Super Admin yang berhak menambah data master.');
        }

        $data = $request->validated();
        $data['created_by'] = Auth::id();
        $room = MeetingRoom::create($data);

        ActivityLogger::log(
            'CREATE_MEETING_ROOM',
            "Menambahkan master ruangan rapat: {$room->name} (Kapasitas: {$room->capacity} orang)"
        );

        return redirect()->route('meeting-rooms.index')
            ->with('success', "Ruangan rapat '{$room->name}' berhasil ditambahkan.");
    }

    /**
     * Update the specified meeting room.
     */
    public function update(MeetingRoomRequest $request, MeetingRoom $meetingRoom): RedirectResponse
    {
        if (Auth::user()?->role !== 'super_admin') {
            abort(403, 'Akses Ditolak: Hanya Super Admin yang berhak memperbarui data master.');
        }

        $data = $request->validated();
        $data['updated_by'] = Auth::id();
        $meetingRoom->update($data);

        ActivityLogger::log(
            'UPDATE_MEETING_ROOM',
            "Memperbarui master ruangan rapat: {$meetingRoom->name}"
        );

        return redirect()->back()
            ->with('success', "Ruangan rapat '{$meetingRoom->name}' berhasil diperbarui.");
    }

    /**
     * Remove the specified meeting room.
     */
    public function destroy(MeetingRoom $meetingRoom): RedirectResponse
    {
        if (Auth::user()?->role !== 'super_admin') {
            abort(403, 'Akses Ditolak: Hanya Super Admin yang berhak menghapus data master.');
        }

        $name = $meetingRoom->name;
        $meetingRoom->delete();

        ActivityLogger::log(
            'DELETE_MEETING_ROOM',
            "Menghapus master ruangan rapat: {$name}"
        );

        return redirect()->back()
            ->with('success', "Ruangan rapat '{$name}' berhasil dihapus.");
    }
}

