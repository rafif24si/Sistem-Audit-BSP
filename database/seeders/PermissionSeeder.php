<?php

namespace Database\Seeders;

use App\Models\Permission;
use Illuminate\Database\Seeder;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $permissions = [
            // 1. Dokumen Master SOP
            ['name' => 'read_sop', 'label' => 'Lihat / Unduh Dokumen SOP', 'module' => 'sop'],
            ['name' => 'create_sop', 'label' => 'Tambah Dokumen SOP Baru', 'module' => 'sop'],
            ['name' => 'update_sop', 'label' => 'Revisi / Ubah Dokumen SOP', 'module' => 'sop'],
            ['name' => 'delete_sop', 'label' => 'Hapus Dokumen SOP', 'module' => 'sop'],

            // 2. Surat Internal
            ['name' => 'read_letters_internal', 'label' => 'Lihat Arsip Surat Internal', 'module' => 'letters_internal'],
            ['name' => 'create_letters_internal', 'label' => 'Buat Surat Internal', 'module' => 'letters_internal'],
            ['name' => 'update_letters_internal', 'label' => 'Ubah Surat Internal', 'module' => 'letters_internal'],
            ['name' => 'delete_letters_internal', 'label' => 'Hapus Surat Internal', 'module' => 'letters_internal'],

            // 3. Surat Eksternal
            ['name' => 'read_letters_external', 'label' => 'Lihat Arsip Surat Eksternal', 'module' => 'letters_external'],
            ['name' => 'create_letters_external', 'label' => 'Buat Surat Eksternal', 'module' => 'letters_external'],
            ['name' => 'update_letters_external', 'label' => 'Ubah / Update Follow-Up Surat', 'module' => 'letters_external'],
            ['name' => 'delete_letters_external', 'label' => 'Hapus Surat Eksternal', 'module' => 'letters_external'],

            // 4. Persetujuan Surat Keluar
            ['name' => 'approve_letter', 'label' => 'Verifikasi & Setujui Surat Keluar', 'module' => 'letters_approval'],

            // 5. Lembar Disposisi
            ['name' => 'read_disposition', 'label' => 'Lihat Lembar Disposisi', 'module' => 'dispositions'],
            ['name' => 'create_disposition', 'label' => 'Terbitkan Disposisi Baru', 'module' => 'dispositions'],
            ['name' => 'update_disposition', 'label' => 'Tindak Lanjut / Ubah Status Disposisi', 'module' => 'dispositions'],
            ['name' => 'delete_disposition', 'label' => 'Hapus Lembar Disposisi', 'module' => 'dispositions'],

            // 6. Jadwal Rapat & E-Notulen
            ['name' => 'read_meeting', 'label' => 'Lihat Agenda & E-Notulen Rapat', 'module' => 'meetings'],
            ['name' => 'create_meeting', 'label' => 'Jadwalkan Rapat Audit Baru', 'module' => 'meetings'],
            ['name' => 'update_meeting', 'label' => 'Ubah Jadwal & Catat E-Notulen', 'module' => 'meetings'],
            ['name' => 'delete_meeting', 'label' => 'Hapus / Batalkan Agenda Rapat', 'module' => 'meetings'],

            // 7. Indikator Kinerja Kunci (KPI)
            ['name' => 'read_kpi', 'label' => 'Lihat Kartu Capaian KPI', 'module' => 'kpis'],
            ['name' => 'create_kpi', 'label' => 'Tambah Target Indikator KPI', 'module' => 'kpis'],
            ['name' => 'update_kpi', 'label' => 'Update Progres & Realisasi KPI', 'module' => 'kpis'],
            ['name' => 'delete_kpi', 'label' => 'Hapus Indikator KPI', 'module' => 'kpis'],
        ];

        // Hapus izin data master dari tabel permissions jika sebelumnya pernah di-seed
        // karena pengelolaan data master merupakan hak mutlak super_admin (bukan hak akses dinamis)
        Permission::where('module', 'master_data')->delete();

        foreach ($permissions as $perm) {
            Permission::updateOrCreate(
                ['name' => $perm['name']],
                $perm
            );
        }
    }
}

