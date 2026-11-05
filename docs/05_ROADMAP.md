# Implementation Roadmap (TODO List) - Sistem Integrasi SPI

Kerjakan daftar di bawah ini secara berurutan (1 kotak per siklus Plan -> Execute -> Verify -> Commit):

## Fase 1: Fondasi Database, Model & Seeder
- [x] Buat seluruh file Migration untuk 7 tabel sesuai spesifikasi di `docs/03_DATABASE.md` (`departments`, `users`, `master_documents`, `letters`, `dispositions`, `meetings`, `activity_logs`).
- [x] Buat seluruh Model Eloquent lengkap dengan `SoftDeletes`, `$fillable`, dan fungsi relasinya (`belongsTo`, `hasMany`).
- [x] Buat `DatabaseSeeder` untuk mengisi data awal Departemen PT BSP (`SPI`, `QHSE`, `FIN&ICT`, dll.) dan 4 akun contoh untuk masing-masing Role (`super_admin`, `manager_spi`, `auditor`, `auditee`), lalu jalankan `php artisan migrate:fresh --seed`.

## Fase 2: Autentikasi (Login + Captcha), Role Middleware & Layout Admin
- [x] Modifikasi halaman Login dan Register bawaan Breeze agar sesuai desain, serta tambahkan fitur validasi **Captcha** pada proses Login.
- [x] Buat Middleware otorisasi Role (`RoleMiddleware`) dan Helper Service `ActivityLogger` untuk mencatat jejak audit otomatis.
- [x] Rancang `AuthenticatedLayout.jsx` menjadi Dashboard Admin utuh dengan Sidebar berwarna `#194f2b`, daftar navigasi menu lengkap, dan Topbar profil pengguna.

## Fase 3: Modul Dokumen Kontrol (SOP Master & Persuratan)
- [x] Buat `DocumentNumberService.php` untuk menangani rumus penomoran otomatis surat keluar (`[No]/SPI/[Kode]/[BulanRomawi]/[Tahun]`) dan penomoran SOP.
- [x] Buat `MasterDocumentController` dan halaman React `Pages/Documents/Index.jsx` untuk CRUD Dokumen Master (SOP/WI/Manual) dengan fitur perubahan status otomatis (`TERKENDALI` vs `KADALUARSA`) dan unduhan file aman.
- [x] Buat `LetterController` dan halaman React `Pages/Letters/Internal.jsx` untuk mengelola Surat Internal (Nomor, Perihal, Tujuan, Asal Surat, Sifat Kerahasiaan, Upload File).
- [x] Buat halaman React `Pages/Letters/External.jsx` untuk mengelola Surat Eksternal lengkap dengan fitur pembaruan status **Follow-Up** (`pending`, `in_progress`, `completed`) dan catatannya.

## Fase 4: Modul Disposisi Digital
- [x] Buat `DispositionController` dan komponen Modal/Halaman Disposisi agar Manager SPI dapat memberikan instruksi pada surat masuk kepada Auditor/Staf beserta tenggat waktunya.
- [x] Buat fitur bagi penerima disposisi untuk memperbarui status tindak lanjut disposisi menjadi `Selesai` beserta catatan laporannya.

## Fase 5: Modul Manajemen Rapat & E-Notulen
- [x] Buat `MeetingController` dan halaman React `Pages/Meetings/Index.jsx` untuk mencatat jadwal rapat (Tanggal, Waktu, Lokasi, Perihal, dan Daftar Undangan).
- [x] Buat halaman detail/form `Pages/Meetings/Show.jsx` untuk pengisian **E-Notulen** (poin diskusi & hasil keputusan rapat) serta penguncian akses khusus peserta/SPI.

## Fase 6: Dashboard Terintegrasi & Finalisasi
- [x] Buat `DashboardController` dan perbarui `Pages/Dashboard.jsx` untuk menampilkan grafik/kartu statistik terintegrasi (Ringkasan Surat, Dokumen Terkendali, Status Follow-Up Eksternal, dan Jadwal Rapat Terdekat).
- [x] Uji coba seluruh fitur filter, pencarian, proteksi unduhan file rahasia, dan jalankan `npm run build` untuk memastikan tidak ada error kompilasi.

## Fase 7: Penguatan Hak Akses (RBAC), Kelola Pengguna & Approval Surat
- [x] Buat Modul Kelola Pengguna (`/users`) khusus Super Admin (`UserController`, `UserRequest`, `Pages/Users/Index.jsx`, `UserModal.jsx`) beserta menu navigasi di Sidebar.
- [x] Buat migration penambahan kolom `recipient_department_id`, `approval_status`, `approved_by`, dan `approval_notes` pada tabel `letters`.
- [x] Implementasikan fitur Approval Surat Keluar (`LetterApprovalRequest`, `LetterController@approve`, `ApprovalModal.jsx`) untuk Manager SPI & Super Admin, serta pilihan Departemen Tujuan pada `LetterModal.jsx`.
- [x] Terapkan isolasi filter surat khusus departemen Auditee, sembunyikan seluruh tombol CRUD (Tambah/Ubah/Hapus) pada Dokumen Master, Surat, dan Rapat bagi role yang tidak berhak, serta proteksi seluruh method di Backend Controller menggunakan `abort(403)` sesuai matriks PRD.
- [x] Jalankan migrasi database (`php artisan migrate:fresh --seed`), pastikan seeder berjalan baik, dan verifikasi kompilasi frontend (`npm run build`).

## Fase 8: Tambahan Mode Rapat (Offline vs Online) & Unduh PDF E-Notulen Ber-Kop Resmi
- [x] Buat migration baru untuk menambahkan kolom `meeting_mode` (`Offline`, `Online`, default: `Offline`) dan menyesuaikan kolom `platform` pada tabel `meetings`, lalu perbarui model `Meeting` dan `MeetingRequest`.
- [x] Perbarui form modal Jadwal Rapat secara kondisional: jika user memilih `Offline`, sembunyikan dropdown platform dan arahkan user langsung mengetik nama tempat/ruangan rapat; jika user memilih `Online`, tampilkan dropdown Platform (`Zoom`, `Google Meet`, `Microsoft Teams`) dan arahkan input lokasi untuk mengisi link/tautan meeting.
- [x] Pasang `barryvdh/laravel-dompdf` (jika belum ada) dan tambahkan method `exportPdf` beserta rutenya (`GET /meetings/{meeting}/pdf`) di `MeetingController` tanpa mengubah fitur simpan E-Notulen yang sudah berjalan di sistem.
- [x] Buat template cetak `resources/views/pdf/notulen.blade.php` dengan Kop Surat Resmi PT Bumi Siak Pusako (Logo resmi PT BSP, Nama Badan Usaha `PT BUMI SIAK PUSAKO`, status BUMD Pengelola WK CPP, alamat Kantor Pusat Gedung Surya Dumai Pekanbaru, Kantor Jakarta, Camp Zamrud, Telepon `(62-761) 855-764`, Email `helpdesk@bsp.co.id`, Website `ptbsp.id / bsp.co.id`), tabel detail rapat, daftar hadir/undangan, pembahasan notulen, serta hasil keputusan rapat, lalu tambahkan tombol **"Unduh PDF"** di halaman `Pages/Meetings/Show.jsx`.

## Fase 9: Pencatatan Indikator Kinerja Kunci (KPI) Fleksibel
- [x] Buat migration baru untuk tabel `kpis` dan Model Eloquent `Kpi` dengan trait `SoftDeletes`.
- [x] Buat `KpiRequest` dan `KpiController` untuk mengelola CRUD pencatatan KPI fleksibel (khusus role `manager_spi` & `super_admin`) beserta pencatatan aktivitas ke `activity_logs`.
- [x] Buat komponen modal kelola KPI (`KpiModal.jsx`) dan section kartu capaian KPI interaktif (`KpiSection.jsx`) di Dashboard utama.
- [x] Perbarui `DashboardController` untuk memuat data indikator KPI fleksibel beserta ringkasan metrik realisasinya.
- [x] Tambahkan seeder data awal KPI SPI realistis di `DemoDataSeeder.php`, jalankan migrasi, dan pastikan `npm run build` sukses.

## Fase 10: Integrasi Notifikasi Email Undangan Rapat (Bebas/Eksternal)
- [x] Ubah form input peserta di React (`MeetingModal.jsx` atau form terkait) menjadi *Dynamic Email Tag Input* agar pengguna bisa mengetik alamat email bebas dengan menekan spasi/enter.
- [x] Buat Mailable class `app/Mail/MeetingInvitationMail.php` dan template Blade `resources/views/emails/meeting_invitation.blade.php` dengan desain korporat (berisi Logo PT BSP, Agenda, Waktu, Mode & Lokasi/Link, dan pesan undangan).
- [x] Modifikasi `MeetingController@store`. Setelah data rapat tersimpan, lakukan *looping* pada array email di kolom `invitees` (JSON) dan kirimkan email undangan ke masing-masing alamat tersebut. Gunakan blok `try-catch` agar aplikasi tidak *crash* jika terjadi kegagalan pada pengiriman email.

## Fase 11: Fitur Pembaruan Jadwal & Kirim Ulang Email (Resend Notification)
- [x] Modifikasi form edit di `MeetingModal.jsx` dengan mengubah label tombol menjadi "Simpan Perubahan & Kirim Ulang", serta tambahkan *checkbox* opsional `is_resend_email` (default: true) agar Manager bisa memilih apakah peserta perlu dinotifikasi ulang atau tidak.
- [x] Buat Mailable class baru `app/Mail/MeetingUpdatedMail.php` dan template Blade `resources/views/emails/meeting_updated.blade.php` khusus untuk menginformasikan bahwa ada **Perubahan/Revisi Jadwal Rapat** (tampilkan highlight perubahan jika memungkinkan, atau sekadar detail jadwal terbaru).
- [x] Modifikasi `MeetingController@update`. Tangkap nilai `is_resend_email`. Jika `true`, lakukan *looping* pada kolom `invitees` yang baru dan kirimkan `MeetingUpdatedMail` ke semua peserta dengan perlindungan `try-catch`.

## Fase 12: Penyempurnaan Hak Akses, Data Master, Log Aktivitas, dan UI
- [x] Implementasikan Manajemen Data Master eksklusif untuk Super Admin. Buat entitas/tabel (beserta Migration, Model, dan Controller) untuk:
  - Master Departemen
  - Master Jenis Rapat
  - Master Kategori KPI
- [x] Implementasikan Manajemen Data Master tambahan khusus untuk **Master Ruangan Rapat (`meeting_rooms`)** (Migration, Model, Controller, Request, dan UI CRUD).
- [x] Hubungkan form pembuatan jadwal rapat, pengelolaan KPI, dan user management dengan Data Master yang telah dibuat agar opsi dropdown menjadi dinamis.
- [x] Perbarui form `MeetingModal.jsx`: Hubungkan input lokasi dengan Master Ruangan Rapat. Jika pengguna memilih mode `Offline`, ubah input teks biasa menjadi *dropdown* yang mengambil data dinamis dari tabel `meeting_rooms`.
- [x] Modifikasi form Dokumen Master SOP (`DocumentModal.jsx`) untuk menghapus input versi manual. Buat logika di Controller (`MasterDocumentController@store`) untuk men-*generate* dan menetapkan versi dokumen secara otomatis (misal: dimulai dari `01` dan bertambah pada setiap revisi).
- [x] Tambahkan validasi pada `LetterRequest` atau `LetterController` untuk mewajibkan lampiran file (`file_path` required) saat membuat Surat Internal dan Eksternal baru.
- [x] Pastikan Super Admin dapat melakukan CRUD pada seluruh entitas di sistem tanpa batasan kepemilikan departemen, melampaui proteksi hak akses *role* lainnya.
- [x] Modifikasi komponen tabel (atau view terkait) di antarmuka pengguna agar kolom yang berisi tombol aksi (*Edit*, *Delete*, *Download*) dipindahkan ke sisi paling kiri (sebelum kolom nomor/judul).
- [x] Perkuat pencatatan log aktivitas. Pastikan setiap tindakan pengunggahan atau perubahan dokumen dan surat tercatat dengan detail di tabel `activity_logs`.
- [x] Modifikasi komponen `Sidebar.jsx`. Kelompokkan menu "Kelola Pengguna", "Log Aktivitas", dan semua menu "Data Master" (Departemen, Jenis Rapat, Kategori KPI, dan **Ruang Rapat**) ke dalam satu menu *Dropdown/Collapsible* (misal bernama "Pengaturan Sistem" atau "Data Master"). Pastikan dropdown ini hanya di-render untuk role `super_admin`.

## Fase 13: Audit Trail Lanjutan, Refactoring Fitur Rapat & Modul KPI (Pembaruan Diskusi)
- [x] Ubah migrasi tabel `activity_logs`. Tambahkan kolom `old_values` (JSON) dan `new_values` (JSON) nullable. Perbarui fungsi `ActivityLogger` agar bisa menyimpan rekaman state lama dan state baru. Implementasikan di proses CRUD kritikal (seperti edit dokumen SOP, edit surat).
- [x] Refactor form Modul Rapat:
  - Buat migration update untuk tabel `meetings`, ubah `meeting_date` menjadi `meeting_date_start` (date) dan tambahkan `meeting_date_end` (date).
  - Hapus status 'Berlangsung'. Rapat hanya memiliki siklus: 'Terjadwal' -> 'Selesai' -> 'Dibatalkan'.
  - Pastikan pengisian E-Notulen HANYA diperbolehkan setelah status rapat berubah menjadi 'Selesai'.
- [x] Refactor Manajemen KPI:
  - Buat migration update untuk tabel `kpis`. Tambahkan kolom `polarity` (enum: 'positive', 'negative' - default: positive) dan `evidence_path` (upload lampiran bukti progress).
  - Modifikasi UI Modul KPI agar mendukung penambahan log capaian secara berkala (*Update Progress* KPI) lengkap dengan upload berkas dan kolom catatan progress, yang otomatis men-trigger kalkulasi *progress bar* di dashboard.
- [x] Modifikasi sistem Role/Permission: Jangan *hardcode* role untuk user. Sediakan matriks checklist (UI Module Rights) di menu "Kelola Pengguna" agar Super Admin bisa memberi/mencabut hak akses fungsi secara spesifik atau memberikan akses PJS (*Penanggung Jawab Sementara*). (Opsional: Jika kompleks, gunakan library pihak ketiga seperti `spatie/laravel-permission`).

## Fase 14: Pemisahan Modul Hak Akses Dinamis & PJS (Role Management)
- [x] Instalasi dan Konfigurasi Library: Instal package `spatie/laravel-permission` (rekomendasi untuk kemudahan) atau buat tabel custom `permissions` dan `user_permissions`. Jalankan migration untuk membuat tabel-tabel hak akses tersebut.
- [x] Update Tabel Users (Fitur PJS): Buat migration untuk menambahkan kolom `pjs_role` (varchar, nullable), `pjs_start_date` (date, nullable), dan `pjs_end_date` (date, nullable) pada tabel `users`.
- [x] Refactor Form Pengguna: Buka `UserModal.jsx` (Modul Kelola Pengguna). Hapus bagian pengaturan hak akses dan PJS dari form ini. Kembalikan fungsinya murni hanya untuk manajemen identitas (Nama, Email, Password, Departemen).
- [x] Pembuatan Halaman Baru: Buat `PermissionController` dan halaman React baru `Pages/Permissions/Index.jsx` (Kelola Hak Akses & PJS). Tambahkan link menu ini di `Sidebar.jsx` (di dalam dropdown Pengaturan Sistem, di bawah Kelola Pengguna).
- [x] Desain UI Matriks Hak Akses: Di halaman `/permissions`, buat antarmuka di mana Super Admin bisa memilih pengguna, lalu memunculkan tabel Matriks CRUD (Create, Read, Update, Delete) per modul (SOP, Surat Internal, Surat Eksternal, Rapat) menggunakan checkbox.
- [x] Desain UI & Logika PJS: Pada halaman yang sama, tambahkan form *toggle* "Tetapkan sebagai PJS". Pastikan ada pengecekan di backend (Middleware / Gate) di mana jika tanggal hari ini sudah melewati `pjs_end_date`, maka hak akses PJS tersebut otomatis diabaikan (gugur).
