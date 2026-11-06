<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return auth()->check() ? redirect()->route('dashboard') : redirect()->route('login');
});

Route::get('/dashboard', [\App\Http\Controllers\DashboardController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard');


Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Dokumen Master SOP
    Route::get('/documents/generate-number', [\App\Http\Controllers\MasterDocumentController::class, 'generateNumber'])->name('documents.generate-number');
    Route::get('/documents/{document}/download', [\App\Http\Controllers\MasterDocumentController::class, 'download'])->name('documents.download');
    Route::resource('documents', \App\Http\Controllers\MasterDocumentController::class)->except(['create', 'show', 'edit']);

    // Persuratan Internal & Eksternal
    Route::get('/letters/internal', [\App\Http\Controllers\LetterController::class, 'internal'])->name('letters.internal');
    Route::get('/letters/external', [\App\Http\Controllers\LetterController::class, 'external'])->name('letters.external');
    Route::get('/letters/generate-number', [\App\Http\Controllers\LetterController::class, 'generateNumber'])->name('letters.generate-number');
    Route::post('/letters', [\App\Http\Controllers\LetterController::class, 'store'])->name('letters.store');
    Route::put('/letters/{letter}', [\App\Http\Controllers\LetterController::class, 'update'])->name('letters.update');
    Route::patch('/letters/{letter}/followup', [\App\Http\Controllers\LetterController::class, 'updateFollowUp'])->name('letters.update-followup');
    Route::patch('/letters/{letter}/approve', [\App\Http\Controllers\LetterController::class, 'approve'])->name('letters.approve');
    Route::delete('/letters/{letter}', [\App\Http\Controllers\LetterController::class, 'destroy'])->name('letters.destroy');
    Route::get('/letters/{letter}/download', [\App\Http\Controllers\LetterController::class, 'download'])->name('letters.download');

    // Lembar Disposisi Digital
    Route::get('/dispositions', [\App\Http\Controllers\DispositionController::class, 'index'])->name('dispositions.index');
    Route::post('/dispositions', [\App\Http\Controllers\DispositionController::class, 'store'])->name('dispositions.store');
    Route::put('/dispositions/{disposition}', [\App\Http\Controllers\DispositionController::class, 'update'])->name('dispositions.update');
    Route::patch('/dispositions/{disposition}/status', [\App\Http\Controllers\DispositionController::class, 'updateStatus'])->name('dispositions.update-status');
    Route::delete('/dispositions/{disposition}', [\App\Http\Controllers\DispositionController::class, 'destroy'])->name('dispositions.destroy');

    // Manajemen Rapat & E-Notulen
    Route::get('/meetings', [\App\Http\Controllers\MeetingController::class, 'index'])->name('meetings.index');
    Route::post('/meetings', [\App\Http\Controllers\MeetingController::class, 'store'])->name('meetings.store');
    Route::get('/meetings/{meeting}', [\App\Http\Controllers\MeetingController::class, 'show'])->name('meetings.show');
    Route::put('/meetings/{meeting}', [\App\Http\Controllers\MeetingController::class, 'update'])->name('meetings.update');
    Route::patch('/meetings/{meeting}/status', [\App\Http\Controllers\MeetingController::class, 'updateStatus'])->name('meetings.update-status');
    Route::patch('/meetings/{meeting}/minutes', [\App\Http\Controllers\MeetingController::class, 'updateMinutes'])->name('meetings.update-minutes');
    Route::delete('/meetings/{meeting}', [\App\Http\Controllers\MeetingController::class, 'destroy'])->name('meetings.destroy');
    Route::get('/meetings/{meeting}/download', [\App\Http\Controllers\MeetingController::class, 'downloadAttachment'])->name('meetings.download');
    Route::get('/meetings/{meeting}/pdf', [\App\Http\Controllers\MeetingController::class, 'exportPdf'])->name('meetings.pdf');
    
    // Pencatatan Indikator Kinerja (KPI) Fleksibel
    Route::post('/kpis', [\App\Http\Controllers\KpiController::class, 'store'])->name('kpis.store');
    Route::put('/kpis/{kpi}', [\App\Http\Controllers\KpiController::class, 'update'])->name('kpis.update');
    Route::post('/kpis/{kpi}/progress', [\App\Http\Controllers\KpiController::class, 'updateProgress'])->name('kpis.update-progress');
    Route::get('/kpis/{kpi}/evidence', [\App\Http\Controllers\KpiController::class, 'downloadEvidence'])->name('kpis.evidence');
    Route::delete('/kpis/{kpi}', [\App\Http\Controllers\KpiController::class, 'destroy'])->name('kpis.destroy');
    
    // Khusus Super Admin (Kelola Pengguna, Hak Akses & PJS, Data Master & Audit Trail)
    Route::middleware('role:super_admin')->group(function () {
        Route::resource('users', \App\Http\Controllers\UserController::class)->except(['create', 'show', 'edit']);
        Route::get('/permissions', [\App\Http\Controllers\PermissionController::class, 'index'])->name('permissions.index');
        Route::put('/permissions/{user}', [\App\Http\Controllers\PermissionController::class, 'updateUserPermissions'])->name('permissions.update');
        Route::post('/permissions/{user}/pjs', [\App\Http\Controllers\PermissionController::class, 'updateUserPjs'])->name('permissions.update-pjs');
        Route::delete('/permissions/{user}/pjs', [\App\Http\Controllers\PermissionController::class, 'revokeUserPjs'])->name('permissions.revoke-pjs');
        Route::get('/activity-logs', [\App\Http\Controllers\ActivityLogController::class, 'index'])->name('activity-logs.index');

        // Manajemen Data Master
        Route::resource('departments', \App\Http\Controllers\DepartmentController::class)->except(['create', 'show', 'edit']);
        Route::resource('meeting-types', \App\Http\Controllers\MeetingTypeController::class)->except(['create', 'show', 'edit']);
        Route::resource('kpi-categories', \App\Http\Controllers\KpiCategoryController::class)->except(['create', 'show', 'edit']);
        Route::resource('meeting-rooms', \App\Http\Controllers\MeetingRoomController::class)->except(['create', 'show', 'edit']);
        Route::resource('meeting-platforms', \App\Http\Controllers\MeetingPlatformController::class)->except(['create', 'show', 'edit']);
    });
});

require __DIR__.'/auth.php';
