<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ActivityLog extends Model
{
    use HasFactory;

    const UPDATED_AT = null;

    protected $fillable = [
        'user_id',
        'action',
        'description',
        'old_values',
        'new_values',
        'ip_address',
        'created_at',
    ];

    protected $appends = [
        'action_label',
    ];

    protected function casts(): array
    {
        return [
            'old_values' => 'array',
            'new_values' => 'array',
            'created_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class)->withTrashed();
    }

    /**
     * Dictionary mapping technical action strings to Indonesian human-readable labels.
     */
    public static function actionDictionary(): array
    {
        return [
            'CREATE_LETTER' => 'Membuat Surat',
            'UPDATE_LETTER' => 'Memperbarui Surat',
            'DELETE_LETTER' => 'Menghapus Surat',
            'APPROVE_LETTER' => 'Menyetujui Surat',
            'REJECT_LETTER' => 'Menolak Surat',
            'FOLLOW_UP_LETTER' => 'Tindak Lanjut Surat',
            'CREATE_DOCUMENT' => 'Membuat Dokumen SOP',
            'UPDATE_DOCUMENT' => 'Memperbarui Dokumen SOP',
            'DELETE_DOCUMENT' => 'Menghapus Dokumen SOP',
            'CREATE_DISPOSITION' => 'Membuat Disposisi',
            'UPDATE_DISPOSITION' => 'Memperbarui Disposisi',
            'DELETE_DISPOSITION' => 'Menghapus Disposisi',
            'CREATE_MEETING' => 'Membuat Jadwal Rapat',
            'UPDATE_MEETING' => 'Memperbarui Jadwal Rapat',
            'DELETE_MEETING' => 'Menghapus Jadwal Rapat',
            'UPDATE_MINUTES' => 'Memperbarui Notulen Rapat',
            'CREATE_KPI' => 'Membuat Indikator KPI',
            'UPDATE_KPI' => 'Memperbarui Parameter KPI',
            'DELETE_KPI' => 'Menghapus Indikator KPI',
            'UPDATE_KPI_PROGRESS' => 'Memperbarui Progres KPI',
            'CREATE_USER' => 'Menambahkan Pengguna Baru',
            'UPDATE_USER' => 'Memperbarui Data Pengguna',
            'DELETE_USER' => 'Menonaktifkan Akun Pengguna',
            'RESTORE_USER' => 'Mengaktifkan Kembali Pengguna',
            'UPDATE_PERMISSIONS' => 'Memperbarui Matriks Hak Akses',
            'ASSIGN_PJS' => 'Menetapkan Peran PJS',
            'REVOKE_PJS' => 'Mencabut Penugasan PJS',
            'CREATE_DEPARTMENT' => 'Menambahkan Departemen',
            'UPDATE_DEPARTMENT' => 'Memperbarui Departemen',
            'DELETE_DEPARTMENT' => 'Menghapus Departemen',
            'CREATE_EMPLOYEE' => 'Menambahkan Master Pegawai',
            'UPDATE_EMPLOYEE' => 'Memperbarui Data Pegawai',
            'DELETE_EMPLOYEE' => 'Menghapus Data Pegawai',
            'CREATE_KPI_PERIOD' => 'Menambahkan Periode KPI',
            'UPDATE_KPI_PERIOD' => 'Memperbarui Periode KPI',
            'DELETE_KPI_PERIOD' => 'Menghapus Periode KPI',
            'CREATE_MEETING_PLATFORM' => 'Menambahkan Platform Rapat',
            'UPDATE_MEETING_PLATFORM' => 'Memperbarui Platform Rapat',
            'DELETE_MEETING_PLATFORM' => 'Menghapus Platform Rapat',
            'LOGIN' => 'Masuk ke Sistem (Login)',
            'LOGOUT' => 'Keluar dari Sistem (Logout)',
        ];
    }

    /**
     * Accessor for translated action label.
     */
    public function getActionLabelAttribute(): string
    {
        $dict = self::actionDictionary();
        if (isset($dict[$this->action])) {
            return $dict[$this->action];
        }

        // Clean fallback
        $humanized = str_replace(['_', '-'], ' ', (string) $this->action);
        return ucwords(strtolower($humanized));
    }
}
