# Database Schema - Sistem Integrasi SPI (MySQL Laragon)

*Catatan Penting: Seluruh tabel utama di bawah ini wajib menyertakan `$table->timestamps();` dan `$table->softDeletes();` (kecuali `activity_logs`).*

## 1. Tabel `departments` (Master Unit Kerja / Departemen PT BSP)
- `id`: bigint unsigned, PK
- `code`: varchar(20), unique (Contoh: `SPI`, `QHSE`, `FIN&ICT`, `HCM`, `SCM`, `OPS`, `CORSEC`)
- `name`: varchar(255) (Contoh: `Internal Audit (SPI)`, `Quality, Health, Safety & Environment`)
- `timestamps` & `softDeletes`

## 2. Tabel `users` (Pengguna Sistem)
- `id`: bigint unsigned, PK
- `department_id`: foreignId (`departments.id`), nullable
- `name`: varchar(255)
- `email`: varchar(255), unique
- `role`: enum('super_admin', 'manager_spi', 'auditor', 'auditee'), default: 'auditor'
- `password`: varchar(255)
- `timestamps` & `softDeletes`

## 3. Tabel `master_documents` (Dokumen Master SOP, Manual, WI, Formulir)
- `id`: bigint unsigned, PK
- `document_number`: varchar(100), unique (Contoh: `QHSE-BSP/SOP/001`)
- `title`: varchar(255)
- `department_id`: foreignId (`departments.id`)
- `document_type`: enum('MAN', 'SOP', 'WI', 'FORM')
- `version`: varchar(10), default: '00' (Contoh: `00`, `01`, `02`)
- `effective_date`: date (Tanggal berlaku / TMT)
- `expired_date`: date, nullable (Batas retensi 3 tahun)
- `control_status`: enum('TERKENDALI', 'TIDAK_TERKENDALI', 'KADALUARSA'), default: 'TERKENDALI'
- `confidentiality`: enum('Biasa', 'Terbatas', 'Rahasia', 'Sangat Rahasia'), default: 'Terbatas'
- `file_path`: varchar(255)
- `created_by`: foreignId (`users.id`)
- `timestamps` & `softDeletes`

## 4. Tabel `letters` (Surat Internal & Surat Eksternal)
- `id`: bigint unsigned, PK
- `agenda_number`: varchar(100), nullable (Nomor agenda khusus surat masuk)
- `letter_number`: varchar(100), unique (Nomor surat resmi / auto-generated untuk surat keluar)
- `scope`: enum('internal', 'external') (Membedakan Surat Internal dan Eksternal)
- `direction`: enum('incoming', 'outgoing') (Surat Masuk atau Surat Keluar)
- `letter_type_code`: enum('ST', 'PA', 'DT', 'KF', 'TL', 'KS', 'KP', 'UM', 'LHA', 'LAP'), nullable
- `subject`: varchar(255) (Perihal surat)
- `sender`: varchar(255) (Asal surat)
- `recipient`: varchar(255) (Ditujukan kepada)
- `recipient_department_id`: foreignId (`departments.id`), nullable (Unit Kerja / Departemen Tujuan)
- `letter_date`: date (Tanggal surat)
- `received_date`: date, nullable (Tanggal diterima jika surat masuk)
- `confidentiality`: enum('Biasa', 'Terbatas', 'Rahasia', 'Sangat Rahasia'), default: 'Terbatas'
- `approval_status`: enum('draft', 'pending_approval', 'approved', 'rejected'), default: 'approved' (Status persetujuan surat keluar)
- `approved_by`: foreignId (`users.id`), nullable (Manager SPI / Super Admin pemberi persetujuan)
- `approval_notes`: text, nullable (Catatan persetujuan / revisi)
- `file_path`: varchar(255), nullable
- `followup_status`: enum('not_required', 'pending', 'in_progress', 'completed'), default: 'not_required' (Khusus pelacakan Follow-Up Surat Eksternal/Audit)
- `followup_notes`: text, nullable (Catatan hasil follow-up)
- `followup_due_date`: date, nullable (Tenggat waktu follow-up)
- `created_by`: foreignId (`users.id`)
- `timestamps` & `softDeletes`

## 5. Tabel `dispositions` (Lembar Disposisi Digital)
- `id`: bigint unsigned, PK
- `letter_id`: foreignId (`letters.id`), onDelete cascade
- `from_user_id`: foreignId (`users.id`) (Pejabat pemberi disposisi / Manager SPI)
- `to_user_id`: foreignId (`users.id`) (Auditor / Staf penerima disposisi)
- `urgency`: enum('Biasa', 'Segera', 'Kilat'), default: 'Biasa'
- `instruction`: enum('Untuk Diketahui', 'Ditindaklanjuti', 'Dibalas', 'Dikoordinasikan', 'DipelaJari', 'Diarsipkan')
- `notes`: text, nullable (Catatan instruksi Manager)
- `due_date`: date (Tenggat penyelesaian disposisi)
- `status`: enum('pending', 'in_progress', 'completed'), default: 'pending'
- `completion_notes`: text, nullable (Laporan hasil tindak lanjut dari staf)
- `completed_at`: timestamp, nullable
- `timestamps` & `softDeletes`

## 6. Tabel `meetings` (Manajemen Rapat & E-Notulen)
- `id`: bigint unsigned, PK
- `title`: varchar(255) (Perihal / Agenda Rapat)
- `meeting_type`: enum('Entry Meeting', 'Exit Meeting', 'Rapat Internal SPI', 'Rapat Pimpinan')
- `meeting_mode`: enum('Offline', 'Online'), default: 'Offline' (Pilihan pelaksanaan rapat Offline atau Online)
- `platform`: enum('Tatap Muka', 'Zoom', 'Google Meet', 'Microsoft Teams'), nullable, default: 'Tatap Muka' (Jika `meeting_mode` = 'Online', pilih `Zoom`, `Google Meet`, atau `Microsoft Teams`; jika `Offline`, bernilai `Tatap Muka` atau `null`)
- `meeting_date`: date (Tanggal pelaksanaan rapat)
- `start_time`: time
- `end_time`: time, nullable
- `location`: varchar(255) (Nama tempat/ruangan fisik jika Offline, atau tautan/URL meeting jika Online)
- `invitees`: json (Daftar nama/user_id peserta undangan rapat)
- `discussion_points`: longText, nullable (Isi pembahasan rapat / Notulen)
- `decisions`: longText, nullable (Hasil keputusan / kesimpulan rapat)
- `confidentiality`: enum('Biasa', 'Terbatas', 'Rahasia'), default: 'Terbatas'
- `status`: enum('Terjadwal', 'Berlangsung', 'Selesai', 'Dibatalkan'), default: 'Terjadwal'
- `attachment_path`: varchar(255), nullable (File absensi / materi rapat)
- `created_by`: foreignId (`users.id`)
- `timestamps` & `softDeletes`

## 7. Tabel `activity_logs` (Audit Trail Sistem)
- `id`: bigint unsigned, PK
- `user_id`: foreignId (`users.id`), nullable
- `action`: varchar(100) (Contoh: `CREATE_LETTER`, `UPDATE_DISPOSITION`, `ARCHIVE_SOP`)
- `description`: text
- `ip_address`: varchar(45), nullable
- `created_at`: timestamp

## 8. Tabel `kpis` (Pencatatan Indikator Kinerja Fleksibel)
- `id`: bigint unsigned, PK
- `title`: varchar(255) (Nama indikator kinerja, misal: "Penyelesaian Program Kerja Pengawasan Tahunan (PKPT)")
- `category`: enum('Operasional Audit', 'Kepatuhan & Tata Kelola', 'Administrasi & Pelaporan', 'Pengembangan SDM'), default: 'Operasional Audit'
- `target_value`: decimal(8,2) (Nilai target kinerja)
- `realization_value`: decimal(8,2) (Nilai realisasi capaian saat ini)
- `unit`: varchar(50), default: '%' (Satuan ukur: '%', 'Hari', 'Dokumen', 'Kegiatan')
- `period`: varchar(50) (Periode capaian, misal: 'Tahun 2026', 'Triwulan III 2026')
- `status`: enum('Tercapai', 'Dalam Proses', 'Perlu Perhatian', 'Belum Tercapai'), default: 'Dalam Proses'
- `notes`: text, nullable (Catatan evaluasi / kendala pencapaian)
- `order_index`: int, default: 0
- `created_by`: foreignId (`users.id`), nullable
- `updated_by`: foreignId (`users.id`), nullable
- `timestamps` & `softDeletes`