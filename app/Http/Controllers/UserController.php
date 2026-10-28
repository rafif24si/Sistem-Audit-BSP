<?php

namespace App\Http\Controllers;

use App\Http\Requests\UserRequest;
use App\Models\Department;
use App\Models\User;
use App\Services\ActivityLogger;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    /**
     * Display a listing of users (Super Admin only).
     */
    public function index(Request $request): Response
    {
        if (Auth::user()?->role !== 'super_admin') {
            abort(403, 'Akses Ditolak: Hanya Super Admin yang berhak mengakses kelola pengguna.');
        }

        $search = $request->input('search');
        $role = $request->input('role');
        $departmentId = $request->input('department_id');

        $query = User::with('department');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        if ($role) {
            $query->where('role', $role);
        }

        if ($departmentId) {
            $query->where('department_id', $departmentId);
        }

        $users = $query->latest()->paginate(10)->withQueryString();
        $departments = Department::orderBy('name')->get(['id', 'code', 'name']);

        return Inertia::render('Users/Index', [
            'users' => $users,
            'departments' => $departments,
            'filters' => [
                'search' => $search,
                'role' => $role,
                'department_id' => $departmentId,
            ],
        ]);
    }

    /**
     * Store a newly created user in storage.
     */
    public function store(UserRequest $request): RedirectResponse
    {
        if (Auth::user()?->role !== 'super_admin') {
            abort(403, 'Akses Ditolak.');
        }

        $data = $request->validated();
        $data['password'] = Hash::make($data['password']);

        $user = User::create($data);

        ActivityLogger::log(
            'CREATE_USER',
            "Mendaftarkan pengguna baru: {$user->name} ({$user->email}) dengan peran {$user->role}"
        );

        return redirect()->route('users.index')
            ->with('success', "Pengguna {$user->name} berhasil didaftarkan.");
    }

    /**
     * Update the specified user in storage.
     */
    public function update(UserRequest $request, User $user): RedirectResponse
    {
        if (Auth::user()?->role !== 'super_admin') {
            abort(403, 'Akses Ditolak.');
        }

        $data = $request->validated();

        if (!empty($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        } else {
            unset($data['password']);
        }

        $user->update($data);

        ActivityLogger::log(
            'UPDATE_USER',
            "Memperbarui data akun pengguna: {$user->name} ({$user->email})"
        );

        return redirect()->back()
            ->with('success', "Data pengguna {$user->name} berhasil diperbarui.");
    }

    /**
     * Remove the specified user from storage (Soft Delete).
     */
    public function destroy(User $user): RedirectResponse
    {
        if (Auth::user()?->role !== 'super_admin') {
            abort(403, 'Akses Ditolak.');
        }

        if ($user->id === Auth::id()) {
            return redirect()->back()
                ->with('error', 'Anda tidak dapat menghapus akun Anda sendiri saat sedang aktif.');
        }

        $userName = $user->name;
        $user->delete();

        ActivityLogger::log(
            'DELETE_USER',
            "Menonaktifkan / soft delete akun pengguna: {$userName}"
        );

        return redirect()->back()
            ->with('success', "Akun pengguna {$userName} berhasil dihapus.");
    }
}
