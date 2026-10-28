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