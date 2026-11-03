<?php

namespace App\Http\Controllers;

use App\Http\Requests\DepartmentRequest;
use App\Models\Department;
use App\Services\ActivityLogger;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class DepartmentController extends Controller
{
    /**
     * Display a listing of departments.
     */
    public function index(Request $request): Response
    {
        if (Auth::user()?->role !== 'super_admin') {
            abort(403, 'Akses Ditolak: Hanya Super Admin yang berhak mengelola data master departemen.');
        }

        $search = $request->input('search');

        $query = Department::withCount(['users', 'masterDocuments']);

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('code', 'like', "%{$search}%")
                    ->orWhere('name', 'like', "%{$search}%");
            });
        }

        $departments = $query->orderBy('name')->paginate(10)->withQueryString();

        return Inertia::render('MasterData/Departments/Index', [
            'departments' => $departments,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    /**
     * Store a newly created department.
     */
    public function store(DepartmentRequest $request): RedirectResponse
    {
        if (Auth::user()?->role !== 'super_admin') {
            abort(403, 'Akses Ditolak: Hanya Super Admin yang berhak menambah data master.');
        }

        $data = $request->validated();
        $department = Department::create($data);

        ActivityLogger::log(
            'CREATE_DEPARTMENT',
            "Menambahkan master departemen: {$department->code} - {$department->name}"
        );

        return redirect()->route('departments.index')
            ->with('success', "Departemen {$department->code} berhasil ditambahkan.");
    }

    /**
     * Update the specified department.
     */
    public function update(DepartmentRequest $request, Department $department): RedirectResponse
    {
        if (Auth::user()?->role !== 'super_admin') {
            abort(403, 'Akses Ditolak: Hanya Super Admin yang berhak memperbarui data master.');
        }

        $data = $request->validated();
        $department->update($data);

        ActivityLogger::log(
            'UPDATE_DEPARTMENT',
            "Memperbarui master departemen: {$department->code} - {$department->name}"
        );

        return redirect()->back()
            ->with('success', "Data departemen {$department->code} berhasil diperbarui.");
    }

    /**
     * Remove the specified department.
     */
    public function destroy(Department $department): RedirectResponse
    {
        if (Auth::user()?->role !== 'super_admin') {
            abort(403, 'Akses Ditolak: Hanya Super Admin yang berhak menghapus data master.');
        }

        $code = $department->code;
        $name = $department->name;
        $department->delete();

        ActivityLogger::log(
            'DELETE_DEPARTMENT',
            "Menghapus master departemen: {$code} - {$name}"
        );

        return redirect()->back()
            ->with('success', "Departemen {$code} berhasil dihapus.");
    }
}

