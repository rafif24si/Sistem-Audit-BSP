# Technical Architecture (Laravel + Laragon + Inertia React)

## 1. Tech Stack Resmi (Terkunci)
- **Local Environment:** Laragon (PHP 8.2+, MySQL 8.0, Apache/Nginx, Node.js).
- **Backend Framework:** Laravel 11 / 12.
- **Frontend Bridge:** Inertia.js (`@inertiajs/react`).
- **UI Library:** React.js + Tailwind CSS + Lucide React (Ikon).
- **Autentikasi:** Laravel Breeze (Inertia React stack) + Kustomisasi Captcha Login.

## 2. Struktur Direktori Utama
- `app/Models/`: Model Eloquent dengan trait `SoftDeletes` dan relasi antar tabel.
- `app/Http/Controllers/`: Pengatur logika bisnis, penomoran otomatis, dan pemanggil `Inertia::render()`.
- `app/Http/Requests/`: Kelas FormRequest untuk memvalidasi input form dan ukuran/tipe file sebelum masuk ke Controller.
- `app/Services/`: Kelas bantuan khusus, seperti `DocumentNumberService.php` (untuk logika penomoran romawi/urut otomatis) dan `ActivityLogger.php` (untuk mencatat audit trail).
- `database/migrations/`: Skema pembuatan tabel MySQL.
- `resources/js/Layouts/`: `AuthenticatedLayout.jsx` (Layout Dashboard Admin dengan Sidebar Hijau `#194f2b` dan Topbar) serta `GuestLayout.jsx` (Halaman Login + Captcha).
- `resources/js/Pages/`:
  - `Dashboard.jsx` (Statistik & Tabel Terintegrasi)
  - `Documents/` (Manajemen Dokumen Master SOP/WI & Arsip Kadaluarsa)
  - `Letters/` (Surat Internal, Surat Eksternal & Follow-Up, Auto-Numbering)
  - `Dispositions/` (Lembar Disposisi Digital & Tindak Lanjut)
  - `Meetings/` (Jadwal Rapat, Daftar Undangan, dan E-Notulen)
- `resources/js/Components/`: Komponen UI modular (StatusBadge, Modal, DataTable, Pagination, FileUploader).

## 3. Pola Alur Data & Keamanan File
1. **Menampilkan Data (Read):** Route di `web.php` -> Controller mengambil data via Eloquent (difilter sesuai Role pengguna) -> Dikirim ke React via `Inertia::render('NamaHalaman', ['data' => $data])`.
2. **Menyimpan Data (Create/Update):** Form React mengirim data via `useForm` (`post`/`put`) -> Divalidasi oleh FormRequest -> Disimpan ke MySQL -> Mencatat log ke `activity_logs` -> Return `redirect()->back()->with('success', 'Pesan sukses')`.
3. **Penyimpanan Dokumen (Storage):**
   - File disimpan di `storage/app/private/documents/` dengan format nama baku: `[kode_atau_nomor]_[jenis]_[versi].[ext]`.
   - Unduhan atau pratinjau PDF dilayani melalui Controller khusus (`DocumentDownloadController`) yang memeriksa apakah pengguna yang login berhak mengakses tingkat kerahasiaan dokumen tersebut.