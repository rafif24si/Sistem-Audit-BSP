<?php

namespace App\Http\Controllers;

use App\Http\Requests\EmployeeRequest;
use App\Models\Department;
use App\Models\Employee;
use App\Services\ActivityLogger;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class EmployeeController extends Controller
{
    /**
     * Display a listing of employees.
     */
    public function index(Request $request): Response
    {
        if (Auth::user()?->role !== 'super_admin') {
            abort(403, 'Akses Ditolak: Hanya Super Admin yang berhak mengelola data master pegawai.');
        }

        $search = $request->input('search');
        $departmentId = $request->input('department_id');

        $query = Employee::with('department');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        if ($departmentId) {
            $query->where('department_id', $departmentId);
        }

        $employees = $query->orderBy('name')->paginate(10)->withQueryString();
        $departments = Department::orderBy('name')->get(['id', 'code', 'name']);

        return Inertia::render('MasterData/Employees/Index', [
            'employees' => $employees,
            'departments' => $departments,
            'filters' => [
                'search' => $search,
                'department_id' => $departmentId,
            ],
        ]);
    }

    /**
     * Store a newly created employee.
     */
    public function store(EmployeeRequest $request): RedirectResponse
    {
        if (Auth::user()?->role !== 'super_admin') {
            abort(403, 'Akses Ditolak.');
        }

        $data = $request->validated();
        $employee = Employee::create($data);

        ActivityLogger::log(
            'CREATE_EMPLOYEE',
            "Menambahkan master pegawai: {$employee->name} ({$employee->email})"
        );

        return redirect()->route('employees.index')
            ->with('success', "Pegawai '{$employee->name}' berhasil ditambahkan ke master data.");
    }

    /**
     * Update the specified employee.
     */
    public function update(EmployeeRequest $request, Employee $employee): RedirectResponse
    {
        if (Auth::user()?->role !== 'super_admin') {
            abort(403, 'Akses Ditolak.');
        }

        $data = $request->validated();
        $employee->update($data);

        ActivityLogger::log(
            'UPDATE_EMPLOYEE',
            "Memperbarui data master pegawai: {$employee->name} ({$employee->email})"
        );

        return redirect()->back()
            ->with('success', "Data pegawai '{$employee->name}' berhasil diperbarui.");
    }

    /**
     * Remove the specified employee (Soft Delete).
     */
    public function destroy(Employee $employee): RedirectResponse
    {
        if (Auth::user()?->role !== 'super_admin') {
            abort(403, 'Akses Ditolak.');
        }

        $name = $employee->name;
        $employee->delete();

        ActivityLogger::log(
            'DELETE_EMPLOYEE',
            "Menghapus data master pegawai: {$name}"
        );

        return redirect()->back()
            ->with('success', "Pegawai '{$name}' berhasil dihapus dari master data.");
    }
}

