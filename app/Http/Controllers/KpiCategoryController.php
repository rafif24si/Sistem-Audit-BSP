<?php

namespace App\Http\Controllers;

use App\Http\Requests\KpiCategoryRequest;
use App\Models\KpiCategory;
use App\Services\ActivityLogger;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class KpiCategoryController extends Controller
{
    /**
     * Display a listing of KPI categories.
     */
    public function index(Request $request): Response
    {
        if (Auth::user()?->role !== 'super_admin') {
            abort(403, 'Akses Ditolak: Hanya Super Admin yang berhak mengelola data master kategori KPI.');
        }

        $search = $request->input('search');

        $query = KpiCategory::query();

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        $kpiCategories = $query->orderBy('name')->paginate(10)->withQueryString();

        return Inertia::render('MasterData/KpiCategories/Index', [
            'kpiCategories' => $kpiCategories,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    /**
     * Store a newly created KPI category.
     */
    public function store(KpiCategoryRequest $request): RedirectResponse
    {
        if (Auth::user()?->role !== 'super_admin') {
            abort(403, 'Akses Ditolak: Hanya Super Admin yang berhak menambah data master.');
        }

        $data = $request->validated();
        $category = KpiCategory::create($data);

        ActivityLogger::log(
            'CREATE_KPI_CATEGORY',
            "Menambahkan master kategori KPI: {$category->name}"
        );

        return redirect()->route('kpi-categories.index')
            ->with('success', "Kategori KPI '{$category->name}' berhasil ditambahkan.");
    }

    /**
     * Update the specified KPI category.
     */
    public function update(KpiCategoryRequest $request, KpiCategory $kpiCategory): RedirectResponse
    {
        if (Auth::user()?->role !== 'super_admin') {
            abort(403, 'Akses Ditolak: Hanya Super Admin yang berhak memperbarui data master.');
        }

        $data = $request->validated();
        $kpiCategory->update($data);

        ActivityLogger::log(
            'UPDATE_KPI_CATEGORY',
            "Memperbarui master kategori KPI: {$kpiCategory->name}"
        );

        return redirect()->back()
            ->with('success', "Kategori KPI '{$kpiCategory->name}' berhasil diperbarui.");
    }

    /**
     * Remove the specified KPI category.
     */
    public function destroy(KpiCategory $kpiCategory): RedirectResponse
    {
        if (Auth::user()?->role !== 'super_admin') {
            abort(403, 'Akses Ditolak: Hanya Super Admin yang berhak menghapus data master.');
        }

        $name = $kpiCategory->name;
        $kpiCategory->delete();

        ActivityLogger::log(
            'DELETE_KPI_CATEGORY',
            "Menghapus master kategori KPI: {$name}"
        );

        return redirect()->back()
            ->with('success', "Kategori KPI '{$name}' berhasil dihapus.");
    }
}

