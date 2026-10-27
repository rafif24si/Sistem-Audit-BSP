# UI/UX Design Guidelines - Sistem Integrasi SPI

## 1. Karakter Visual & Palet Warna (Terkunci)
- **Tipe Layout:** Aplikasi Web Admin Dashboard (Desktop-First dengan dukungan responsif di layar tablet/HP). Tidak menggunakan Landing Page publik; pengguna yang belum login langsung diarahkan ke halaman Login.
- **Warna Utama Sidebar:** Hijau Tua Korporat **`#194f2b`** dengan teks menu berwarna putih/abu-abu terang (`text-white` / `text-emerald-100`). Menu yang sedang aktif diberikan latar belakang hijau sedikit lebih terang atau aksen putih.
- **Warna Area Konten Utama:** Dominan Putih Bersih (`bg-white`) dengan latar belakang halaman abu-abu sangat muda (`bg-slate-50`) agar kartu dan tabel terlihat kontras dan rapi.
- **Warna Tombol (Buttons) & Aksen:** Kombinasi turunan warna hijau yang serasi:
  - Tombol Utama (Primary): `bg-[#194f2b] hover:bg-[#123b20] text-white`.
  - Tombol Sekunder / Aksi Cepat: `bg-emerald-600 hover:bg-emerald-700 text-white`.
  - Tombol Bahaya / Hapus: `bg-red-600 hover:bg-red-700 text-white`.

## 2. Standar Badge Warna Status & Klasifikasi
Gunakan komponen Badge dengan warna konsisten di seluruh tabel:
- **Status Dokumen Master:**
  - `TERKENDALI`: Hijau (`bg-emerald-100 text-emerald-800 border-emerald-200`)
  - `KADALUARSA`: Merah (`bg-red-100 text-red-800 border-red-200`)
  - `TIDAK TERKENDALI`: Abu-abu (`bg-slate-100 text-slate-800`)
- **Sifat Kerahasiaan Surat/Rapat:**
  - `Biasa`: Biru (`bg-blue-100 text-blue-800`)
  - `Terbatas`: Kuning/Amber (`bg-amber-100 text-amber-800`)
  - `Rahasia`: Oranye (`bg-orange-100 text-orange-800`)
  - `Sangat Rahasia`: Merah Tua (`bg-rose-100 text-rose-900 font-bold`)
- **Derajat Disposisi & Follow-Up:**
  - `Kilat` / `Belum Tindak Lanjut`: Merah (`bg-red-100 text-red-800`)
  - `Segera` / `Dalam Proses`: Biru (`bg-blue-100 text-blue-800`)
  - `Biasa` / `Selesai`: Hijau (`bg-emerald-100 text-emerald-800`)

## 3. Standar Komponen Interaktif
- **Halaman Login + Captcha:** Form login bersih di tengah layar dengan input Email, Password, serta kotak validasi **Captcha** (bisa berupa gambar kode acak atau *math challenge* sederhana yang divalidasi di backend) sebelum tombol "Masuk" dapat diproses.
- **Data Table:** Semua halaman daftar (Surat Internal, Surat Eksternal, SOP, Rapat) wajib memiliki fitur **Search Bar**, **Filter Dropdown** (berdasarkan Status/Kerahasiaan/Tanggal), dan **Pagination**.
- **Indikator Loading:** Saat form disubmit (`processing === true`), tombol wajib `disabled` dan menampilkan teks `"Memproses..."`.
- **Notifikasi Flash:** Pesan sukses atau error dari Laravel (`flash.success` / `flash.error`) wajib muncul sebagai Toast/Banner di pojok kanan atas layar.
- **Empty State:** Jika tabel belum memiliki data, tampilkan ikon dokumen dengan teks `"Belum ada data tercatat"` beserta tombol tambah data.