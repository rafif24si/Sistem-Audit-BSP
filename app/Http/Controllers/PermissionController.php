<?php

namespace App\Http\Controllers;

use App\Models\Permission;
use App\Models\User;
use App\Services\ActivityLogger;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class PermissionController extends Controller
{
    /**
     * Display the Role/Permission Matrix and PJS Management.
     */
    public function index(Request $request): Response
    {
        if (Auth::user()?->role !== 'super_admin') {
            abort(403, 'Akses Ditolak: Hanya Super Admin yang berhak mengelola hak akses dan PJS.');
        }

        $search = $request->input('search');
        $selectedUserId = $request->input('user_id');

        $usersQuery = User::with(['department', 'permissions:id,name'])
            ->orderBy('name');

        if ($search) {
            $usersQuery->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $users = $usersQuery->get([
            'id', 'name', 'email', 'role', 'department_id',
            'pjs_role', 'pjs_start_date', 'pjs_end_date', 'is_pjs'
        ]);

        // Default selected user
        $selectedUser = null;
        if ($selectedUserId) {
            $selectedUser = $users->firstWhere('id', (int) $selectedUserId);
        }
        if (! $selectedUser && $users->isNotEmpty()) {
            $selectedUser = $users->first();
        }

        // Get all permissions grouped by module (eksklusikan master_data karena mutlak super_admin)
        $permissions = Permission::where('module', '!=', 'master_data')
            ->orderBy('id')
            ->get(['id', 'name', 'label', 'module']);
        $groupedPermissions = $permissions->groupBy('module');

        return Inertia::render('Permissions/Index', [
            'users' => $users,
            'selectedUser' => $selectedUser,
            'permissions' => $permissions,
            'groupedPermissions' => $groupedPermissions,
            'filters' => [
                'search' => $search,
                'user_id' => $selectedUser?->id,
            ],
        ]);
    }

    /**
     * Update user's specific permissions (CRUD Matrix).
     */
    public function updateUserPermissions(Request $request, User $user): RedirectResponse
    {
        if (Auth::user()?->role !== 'super_admin') {
            abort(403, 'Akses Ditolak.');
        }

        $request->validate([
            'permission_ids' => ['nullable', 'array'],
            'permission_ids.*' => ['exists:permissions,id'],
        ]);

        $allowedIds = Permission::where('module', '!=', 'master_data')->pluck('id')->toArray();
        $newIds = array_values(array_intersect($request->input('permission_ids', []), $allowedIds));
        $oldNames = $user->permissions()->pluck('name')->toArray();

        $user->permissions()->sync($newIds);

        $newNames = Permission::whereIn('id', $newIds)->pluck('name')->toArray();

        ActivityLogger::logChange(
            'UPDATE_PERMISSIONS',
            "Memperbarui matriks hak akses pengguna: {$user->name} ({$user->email})",
            ['permissions' => $oldNames],
            ['permissions' => $newNames]
        );

        return redirect()->back()->with('success', "Hak akses untuk {$user->name} berhasil diperbarui.");
    }

    /**
     * Assign or update PJS (Penanggung Jawab Sementara).
     */
    public function updateUserPjs(Request $request, User $user): RedirectResponse
    {
        if (Auth::user()?->role !== 'super_admin') {
            abort(403, 'Akses Ditolak.');
        }

        $validated = $request->validate([
            'pjs_role' => ['required', 'string', 'in:manager_spi'],
            'pjs_start_date' => ['required', 'date'],
            'pjs_end_date' => ['required', 'date', 'after_or_equal:pjs_start_date'],
        ]);

        $oldPjs = [
            'pjs_role' => $user->pjs_role,
            'pjs_start_date' => $user->pjs_start_date?->format('Y-m-d'),
            'pjs_end_date' => $user->pjs_end_date?->format('Y-m-d'),
        ];

        $user->update([
            'pjs_role' => $validated['pjs_role'],
            'pjs_start_date' => $validated['pjs_start_date'],
            'pjs_end_date' => $validated['pjs_end_date'],
            'is_pjs' => true,
        ]);

        $newPjs = [
            'pjs_role' => $user->pjs_role,
            'pjs_start_date' => $user->pjs_start_date?->format('Y-m-d'),
            'pjs_end_date' => $user->pjs_end_date?->format('Y-m-d'),
        ];

        ActivityLogger::logChange(
            'ASSIGN_PJS',
            "Menetapkan {$user->name} sebagai PJS Manager SPI ({$validated['pjs_start_date']} s/d {$validated['pjs_end_date']})",
            $oldPjs,
            $newPjs
        );

        return redirect()->back()->with('success', "Penugasan PJS Manager SPI untuk {$user->name} berhasil ditetapkan.");
    }

    /**
     * Revoke PJS assignment.
     */
    public function revokeUserPjs(User $user): RedirectResponse
    {
        if (Auth::user()?->role !== 'super_admin') {
            abort(403, 'Akses Ditolak.');
        }

        $oldPjs = [
            'pjs_role' => $user->pjs_role,
            'pjs_start_date' => $user->pjs_start_date?->format('Y-m-d'),
            'pjs_end_date' => $user->pjs_end_date?->format('Y-m-d'),
        ];

        $user->update([
            'pjs_role' => null,
            'pjs_start_date' => null,
            'pjs_end_date' => null,
            'is_pjs' => false,
        ]);

        ActivityLogger::logChange(
            'REVOKE_PJS',
            "Mencabut penugasan PJS dari pengguna: {$user->name}",
            $oldPjs,
            ['pjs_role' => null, 'pjs_start_date' => null, 'pjs_end_date' => null]
        );

        return redirect()->back()->with('success', "Penugasan PJS untuk {$user->name} berhasil dicabut.");
    }
}

