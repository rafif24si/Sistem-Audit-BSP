<?php

namespace App\Http\Controllers;

use App\Http\Requests\MeetingTypeRequest;
use App\Models\MeetingType;
use App\Services\ActivityLogger;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class MeetingTypeController extends Controller
{
    /**
     * Display a listing of meeting types.
     */
    public function index(Request $request): Response
    {
        if (Auth::user()?->role !== 'super_admin') {
            abort(403, 'Akses Ditolak: Hanya Super Admin yang berhak mengelola data master jenis rapat.');
        }

        $search = $request->input('search');

        $query = MeetingType::query();

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        $meetingTypes = $query->orderBy('name')->paginate(10)->withQueryString();

        return Inertia::render('MasterData/MeetingTypes/Index', [
            'meetingTypes' => $meetingTypes,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    /**
     * Store a newly created meeting type.
     */
    public function store(MeetingTypeRequest $request): RedirectResponse
    {
        if (Auth::user()?->role !== 'super_admin') {
            abort(403, 'Akses Ditolak: Hanya Super Admin yang berhak menambah data master.');
        }

        $data = $request->validated();
        $type = MeetingType::create($data);

        ActivityLogger::log(
            'CREATE_MEETING_TYPE',
            "Menambahkan master jenis rapat: {$type->name}"
        );

        return redirect()->route('meeting-types.index')
            ->with('success', "Jenis rapat '{$type->name}' berhasil ditambahkan.");
    }

    /**
     * Update the specified meeting type.
     */
    public function update(MeetingTypeRequest $request, MeetingType $meetingType): RedirectResponse
    {
        if (Auth::user()?->role !== 'super_admin') {
            abort(403, 'Akses Ditolak: Hanya Super Admin yang berhak memperbarui data master.');
        }

        $data = $request->validated();
        $meetingType->update($data);

        ActivityLogger::log(
            'UPDATE_MEETING_TYPE',
            "Memperbarui master jenis rapat: {$meetingType->name}"
        );

        return redirect()->back()
            ->with('success', "Jenis rapat '{$meetingType->name}' berhasil diperbarui.");
    }

    /**
     * Remove the specified meeting type.
     */
    public function destroy(MeetingType $meetingType): RedirectResponse
    {
        if (Auth::user()?->role !== 'super_admin') {
            abort(403, 'Akses Ditolak: Hanya Super Admin yang berhak menghapus data master.');
        }

        $name = $meetingType->name;
        $meetingType->delete();

        ActivityLogger::log(
            'DELETE_MEETING_TYPE',
            "Menghapus master jenis rapat: {$name}"
        );

        return redirect()->back()
            ->with('success', "Jenis rapat '{$name}' berhasil dihapus.");
    }
}

