<?php

namespace Database\Seeders;

use App\Models\ActivityLog;
use App\Models\Department;
use App\Models\Disposition;
use App\Models\Letter;
use App\Models\MasterDocument;
use App\Models\Meeting;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class DemoDataSeeder extends Seeder
{
    /**
     * Run the database seeds for presentation demo.
     */
    public function run(): void
    {
        $spiDept = Department::where('code', 'SPI')->first();
        $qhseDept = Department::where('code', 'QHSE')->first();
        $opsDept = Department::where('code', 'OPS')->first();
        $finDept = Department::where('code', 'FIN&ICT')->first();

        $admin = User::where('email', 'superadmin@bsp.com')->first();
        $manager = User::where('email', 'manager@bsp.com')->first();
        $leadAuditor = User::where('email', 'auditor@bsp.com')->first();
        $auditorKeu = $leadAuditor;
        $auditeeQhse = User::where('email', 'auditee.qhse@bsp.com')->first();
        $auditeeOps = $auditeeQhse;

        // 1. Dokumen Master SOP Realistis
        $docs = [
            [
                'department_id' => $spiDept->id,
                'created_by' => $manager->id,
                'document_number' => 'SPI-BSP/SOP/001',
                'title' => 'SOP Pelaksanaan Audit Operasional Lapangan WK CPP',
                'document_type' => 'SOP',
                'version' => '02',
                'effective_date' => Carbon::now()->subMonths(3)->format('Y-m-d'),
                'expired_date' => Carbon::now()->addYears(3)->format('Y-m-d'),
                'control_status' => 'TERKENDALI',
                'confidentiality' => 'Terbatas',
                'file_path' => 'private/documents/sop-audit-wk-cpp.pdf',
            ],
            [
                'department_id' => $spiDept->id,
                'created_by' => $manager->id,
                'document_number' => 'SPI-BSP/MAN/001',
                'title' => 'Pedoman Audit Mutu dan Kepatuhan Anti Penyuapan (SMAP)',
                'document_type' => 'MAN',
                'version' => '01',
                'effective_date' => Carbon::now()->subMonths(6)->format('Y-m-d'),
                'expired_date' => Carbon::now()->addYears(5)->format('Y-m-d'),
                'control_status' => 'TERKENDALI',
                'confidentiality' => 'Rahasia',
                'file_path' => 'private/documents/manual-smap-bsp.pdf',
            ],
            [
                'department_id' => $qhseDept->id,
                'created_by' => $manager->id,
                'document_number' => 'QHSE-BSP/WI/004',
                'title' => 'Instruksi Kerja Investigasi Insiden K3LL Fasilitas Gathering Station',
                'document_type' => 'WI',
                'version' => '03',
                'effective_date' => Carbon::now()->subMonth()->format('Y-m-d'),
                'expired_date' => Carbon::now()->addYears(3)->format('Y-m-d'),
                'control_status' => 'TERKENDALI',
                'confidentiality' => 'Biasa',
                'file_path' => 'private/documents/wi-k3ll-gathering-station.pdf',
            ],
            [
                'department_id' => $spiDept->id,
                'created_by' => $leadAuditor->id,
                'document_number' => 'SPI-BSP/FORM/012',
                'title' => 'Formulir Kertas Kerja Audit (KKA) Pengadaan Barang dan Jasa',
                'document_type' => 'FORM',
                'version' => '01',
                'effective_date' => Carbon::now()->subMonths(2)->format('Y-m-d'),
                'expired_date' => Carbon::now()->addYears(2)->format('Y-m-d'),
                'control_status' => 'TERKENDALI',
                'confidentiality' => 'Terbatas',
                'file_path' => 'private/documents/form-kka-scm.xlsx',
            ],
        ];

        foreach ($docs as $d) {
            MasterDocument::updateOrCreate(
                ['document_number' => $d['document_number']],
                $d
            );
        }

        // 2. Persuratan Internal & Eksternal
        $letters = [
            // Surat Masuk Eksternal dari SKK Migas
            [
                'agenda_number' => 'AG-2026-001',
                'letter_number' => '042/SKKMIGAS/AUDIT/X/2026',
                'scope' => 'external',
                'direction' => 'incoming',
                'letter_type_code' => 'KF',
                'subject' => 'Permintaan Klarifikasi Tindak Lanjut Temuan Audit Lifting Migas Triwulan III',
                'sender' => 'SKK Migas Perwakilan Sumbagut',
                'recipient' => 'Kepala SPI PT Bumi Siak Pusako',
                'recipient_department_id' => $spiDept->id,
                'letter_date' => Carbon::today()->subDays(3)->format('Y-m-d'),
                'received_date' => Carbon::today()->subDays(2)->format('Y-m-d'),
                'confidentiality' => 'Rahasia',
                'approval_status' => 'approved',
                'approved_by' => $manager->id,
                'followup_status' => 'in_progress',
                'followup_due_date' => Carbon::today()->addDays(4)->format('Y-m-d'),
                'followup_notes' => 'Auditor Rendra sedang menyusun rekap data verifikasi lifting lapangan Zamrud.',
                'created_by' => $manager->id,
            ],
            // Surat Eksternal yang ditujukan ke QHSE (Auditee Follow-up)
            [
                'agenda_number' => 'AG-2026-002',
                'letter_number' => '077/DLH-SIAK/AUDIT/X/2026',
                'scope' => 'external',
                'direction' => 'incoming',
                'letter_type_code' => 'UM',
                'subject' => 'Hasil Evaluasi Pengelolaan Lingkungan & Limbah B3 Fasilitas Migas Zamrud',
                'sender' => 'Dinas Lingkungan Hidup Kabupaten Siak',
                'recipient' => 'Kepala Departemen QHSE PT BSP',
                'recipient_department_id' => $qhseDept->id,
                'letter_date' => Carbon::today()->subDays(4)->format('Y-m-d'),
                'received_date' => Carbon::today()->subDays(3)->format('Y-m-d'),
                'confidentiality' => 'Terbatas',
                'approval_status' => 'approved',
                'approved_by' => $manager->id,
                'followup_status' => 'in_progress',
                'followup_due_date' => Carbon::today()->addDays(5)->format('Y-m-d'),
                'followup_notes' => 'PIC QHSE sedang menyiapkan tanggapan teknis pemilahan limbah di TPS Zamrud.',
                'created_by' => $manager->id,
            ],
            // Surat Internal Ditujukan ke Departemen QHSE (Auditee View)
            [
                'agenda_number' => 'AG-2026-003',
                'letter_number' => '022/SPI/PA/X/2026',
                'scope' => 'internal',
                'direction' => 'outgoing',
                'letter_type_code' => 'PA',
                'subject' => 'Pemberitahuan Pelaksanaan Audit Kepatuhan Lingkungan dan K3LL Semester II',
                'sender' => 'Satuan Pengawasan Intern (SPI)',
                'recipient' => 'Kepala Departemen QHSE',
                'recipient_department_id' => $qhseDept->id,
                'letter_date' => Carbon::today()->subDays(2)->format('Y-m-d'),
                'received_date' => Carbon::today()->subDay()->format('Y-m-d'),
                'confidentiality' => 'Terbatas',
                'approval_status' => 'approved',
                'approved_by' => $manager->id,
                'followup_status' => 'not_required',
                'created_by' => $leadAuditor->id,
            ],
            // Surat Keluar Konsep Auditor - MENUNGGU PERSETUJUAN (Pending Approval)
            [
                'agenda_number' => null,
                'letter_number' => '046/SPI/ST/X/2026',
                'scope' => 'internal',
                'direction' => 'outgoing',
                'letter_type_code' => 'ST',
                'subject' => 'Konsep Surat Tugas Verifikasi Lapangan Fasilitas Produksi Pedada WK CPP',
                'sender' => 'Satuan Pengawasan Intern PT BSP',
                'recipient' => 'General Manager Operations WK CPP',
                'recipient_department_id' => $opsDept->id,
                'letter_date' => Carbon::today()->format('Y-m-d'),
                'received_date' => null,
                'confidentiality' => 'Terbatas',
                'approval_status' => 'pending_approval',
                'approved_by' => null,
                'approval_notes' => null,
                'followup_status' => 'not_required',
                'created_by' => $leadAuditor->id,
            ],
            // Surat Keluar Internal SPI (LHA ke Direksi)
            [
                'agenda_number' => 'AG-2026-004',
                'letter_number' => '014/LHA-SPI/X/2026',
                'scope' => 'internal',
                'direction' => 'outgoing',
                'letter_type_code' => 'LHA',
                'subject' => 'Laporan Hasil Audit (LHA) Kepatuhan Pengadaan Logistik Rig Lapangan',
                'sender' => 'Satuan Pengawasan Intern PT BSP',
                'recipient' => 'Direksi PT Bumi Siak Pusako',
                'recipient_department_id' => $spiDept->id,
                'letter_date' => Carbon::today()->subDay()->format('Y-m-d'),
                'received_date' => Carbon::today()->format('Y-m-d'),
                'confidentiality' => 'Sangat Rahasia',
                'approval_status' => 'approved',
                'approved_by' => $manager->id,
                'followup_status' => 'completed',
                'followup_due_date' => null,
                'followup_notes' => 'LHA final telah diserahkan dan dijadwalkan rapat exit meeting.',
                'created_by' => $leadAuditor->id,
            ],
        ];

        $createdLetters = [];
        foreach ($letters as $l) {
            $createdLetters[] = Letter::updateOrCreate(
                ['letter_number' => $l['letter_number']],
                $l
            );
        }

        // 3. Lembar Disposisi Digital
        // Disposisi dari Manager SPI ke Lead Auditor untuk Surat SKK Migas
        if (!empty($createdLetters[0])) {
            Disposition::updateOrCreate(
                ['letter_id' => $createdLetters[0]->id, 'to_user_id' => $leadAuditor->id],
                [
                    'from_user_id' => $manager->id,
                    'instruction' => 'Ditindaklanjuti',
                    'urgency' => 'Kilat',
                    'notes' => 'Harap segera lakukan rekonsiliasi data lifting dengan Tim Operasi dan Keuangan. Siapkan draf tanggapan resmi sebelum batas waktu.',
                    'due_date' => Carbon::today()->addDays(3)->format('Y-m-d'),
                    'status' => 'in_progress',
                    'completion_notes' => 'Draf rekonsiliasi telah selesai 80%, menunggu konfirmasi akhir tim keuangan.',
                ]
            );
        }

        // Disposisi dari Manager SPI ke Auditor Keuangan untuk Permohonan Audit Operasi
        if (!empty($createdLetters[2])) {
            Disposition::updateOrCreate(
                ['letter_id' => $createdLetters[2]->id, 'to_user_id' => $auditorKeu->id],
                [
                    'from_user_id' => $manager->id,
                    'instruction' => 'DipelaJari',
                    'urgency' => 'Segera',
                    'notes' => 'Teliti rincian RAB penggantian pipa transmisi gas dan jadwalkan uji fisik ke lokasi gathering station.',
                    'due_date' => Carbon::today()->addDays(5)->format('Y-m-d'),
                    'status' => 'pending',
                ]
            );
        }

        // 4. Jadwal Rapat & E-Notulen
        $meetings = [
            [
                'created_by' => $manager->id,
                'title' => 'Entry Meeting Audit Kepatuhan Lingkungan & K3LL WK CPP Semester II',
                'meeting_type' => 'Entry Meeting',
                'meeting_mode' => 'Online',
                'platform' => 'Zoom',
                'meeting_date' => Carbon::today()->addDays(2)->format('Y-m-d'),
                'start_time' => '09:00:00',
                'end_time' => '11:30:00',
                'location' => 'https://zoom.us/j/9284719284?pwd=BSP2026Meeting',
                'invitees' => ['auditor@bsp.com', 'auditee.qhse@bsp.com'],
                'discussion_points' => 'Pembahasan ruang lingkup audit, ketersediaan dokumen AMDAL, izin pembuangan limbah air terproduksi, dan jadwal peninjauan lapangan Zamrud.',
                'decisions' => "1. Tim QHSE menyiapkan seluruh dokumen sertifikasi K3 sebelum hari Kamis.\n2. Peninjauan lapangan dijadwalkan pada tanggal 30 Oktober 2026.\n3. PIC lapangan wajib mendampingi tim auditor selama pengujian emisi cerobong.",
                'status' => 'Terjadwal',
                'confidentiality' => 'Terbatas',
            ],
            [
                'created_by' => $leadAuditor->id,
                'title' => 'Exit Meeting Hasil Audit Pengadaan Logistik Rig Lapangan',
                'meeting_type' => 'Exit Meeting',
                'meeting_mode' => 'Offline',
                'platform' => 'Tatap Muka',
                'meeting_date' => Carbon::today()->addDays(4)->format('Y-m-d'),
                'start_time' => '14:00:00',
                'end_time' => '16:00:00',
                'location' => 'Ruang Rapat Integritas SPI PT BSP, Gd. Surya Dumai Lt. 4',
                'invitees' => ['manager@bsp.com', 'auditor@bsp.com', 'auditee.qhse@bsp.com'],
                'discussion_points' => 'Pemaparan draf temuan audit terkait waktu tunggu suku cadang rig pengeboran dan kepatuhan pembayaran termin vendor kontraktor.',
                'decisions' => "1. Manajemen Operasi menerima draf rekomendasi audit SPI.\n2. Departemen Operasi akan menyerahkan matriks tanggapan manajemen dalam tempo 14 hari kalender.\n3. SPI akan memantau pelaksanaan perbaikan berkala.",
                'status' => 'Terjadwal',
                'confidentiality' => 'Rahasia',
            ],
            [
                'created_by' => $manager->id,
                'title' => 'Rapat Internal SPI Evaluasi Progres Audit Triwulan IV',
                'meeting_type' => 'Rapat Internal SPI',
                'meeting_mode' => 'Offline',
                'platform' => 'Tatap Muka',
                'meeting_date' => Carbon::today()->addDays(6)->format('Y-m-d'),
                'start_time' => '08:30:00',
                'end_time' => '10:00:00',
                'location' => 'Ruang Diskusi SPI Lantai 4',
                'invitees' => ['manager.spi@bsp.co.id', 'auditor.spi@bsp.co.id', 'auditor.keuangan@bsp.co.id'],
                'discussion_points' => 'Monitoring penyelesaian penugasan audit tahunan dan penutupan rekomendasi audit sebelumnya.',
                'decisions' => 'Fokus penuntasan PKPT (Program Kerja Audit Tahunan) mencapai 95% sebelum akhir November 2026.',
                'status' => 'Terjadwal',
                'confidentiality' => 'Biasa',
            ],
        ];

        foreach ($meetings as $m) {
            Meeting::updateOrCreate(
                ['title' => $m['title']],
                $m
            );
        }

        // 5. Activity Logs (Audit Trail)
        $activities = [
            [
                'user_id' => $manager->id,
                'action' => 'CREATE_DISPOSITION',
                'description' => 'Menerbitkan disposisi kilat tindak lanjut klarifikasi lifting SKK Migas kepada Rendra Pratama',
                'ip_address' => '192.168.1.10',
            ],
            [
                'user_id' => $leadAuditor->id,
                'action' => 'UPDATE_FOLLOWUP',
                'description' => 'Memperbarui status tindak lanjut surat eksternal SKK Migas menjadi dalam proses',
                'ip_address' => '192.168.1.15',
            ],
            [
                'user_id' => $manager->id,
                'action' => 'PUBLISH_SOP',
                'description' => 'Menerbitkan dokumen master terkendali SPI-BSP/SOP/001 revisi 02',
                'ip_address' => '192.168.1.10',
            ],
            [
                'user_id' => $leadAuditor->id,
                'action' => 'SCHEDULE_MEETING',
                'description' => 'Menjadwalkan Entry Meeting Audit Kepatuhan Lingkungan & K3LL WK CPP',
                'ip_address' => '192.168.1.15',
            ],
            [
                'user_id' => $admin->id,
                'action' => 'SECURITY_LOGIN',
                'description' => 'Super Administrator berhasil login dengan verifikasi tantangan captcha',
                'ip_address' => '127.0.0.1',
            ],
        ];

        foreach ($activities as $act) {
            ActivityLog::create($act);
        }
    }
}
