# Product Requirements Document (PRD) - Sistem Integrasi SPI PT Bumi Siak Pusako

## 1. Ringkasan Proyek
- **Nama Aplikasi:** Sistem Integrasi SPI (Satuan Pengawasan Intern) PT Bumi Siak Pusako.
- **Bentuk Aplikasi:** Aplikasi Web Internal berbentuk Dashboard Admin (Bukan Landing Page publik).
- **Masalah Utama:** Pengelolaan dokumen pedoman (SOP), pencatatan surat masuk/keluar, pemantauan disposisi, serta pendataan jadwal dan notulen rapat petinggi audit masih terpisah-pisah dan belum terstandarisasi secara digital.
- **Solusi:** Membangun platform terpusat berbasis web untuk mengintegrasikan Kontrol Dokumen (Persuratan, Disposisi, Arsip SOP) dan Manajemen Rapat (Jadwal & E-Notulen) dalam satu ekosistem yang aman dan terlacak.

## 2. Peran Pengguna (User Roles & Hak Akses)
1. **Super Admin (Pengelola Dokumen SPI / IT):** Memiliki akses penuh ke seluruh modul, mengelola data pengguna/departemen, memverifikasi penomoran surat, serta mengatur dokumen master (SOP/Pedoman).
2. **Manager SPI (Kepala Audit):** Melihat statistik dashboard, membuat jadwal rapat, memberikan instruksi disposisi pada surat masuk, dan memberikan persetujuan (approval) pada surat keluar atau laporan.
3. **Auditor / Staf SPI:** Menginput konsep surat keluar, mencatat notulen hasil rapat, menindaklanjuti instruksi disposisi dari Manager, dan mengakses dokumen terkendali.
4. **Auditee (PIC Departemen Terkait):** Hanya dapat melihat surat/undangan yang ditujukan ke departemennya, melihat notulen rapat terkait (entry/exit meeting), dan mengunggah dokumen tindak lanjut (follow-up).

## 3. Spesifikasi Modul & Fitur Utama (MVP)

### Modul 1: Autentikasi & Dashboard Terintegrasi
- **Login & Register:** Dilengkapi fitur keamanan validasi **Captcha** saat login.
- **Dashboard Utama:** Menampilkan kartu ringkasan statistik (Total Dokumen Terkendali, Surat Masuk Belum Didisposisi, Surat Eksternal Butuh Follow-Up, dan Jadwal Rapat Terdekat) serta tabel aktivitas terbaru yang menggabungkan aktivitas dokumen dan rapat.

### Modul 2: Dokumen Kontrol & Persuratan
1. **Penomoran Surat Otomatis (Auto-Numbering):**
   - Menghilangkan buku agenda fisik. Saat staf membuat Surat Keluar atau Laporan, sistem otomatis membuat nomor baku:
   - Format Surat Keluar: `[No.Urut]/SPI/[Kode Jenis]/[Bulan Romawi]/[Tahun]` (Contoh: `045/SPI/ST/X/2026`).
   - Format Laporan Hasil Audit: `[No.Urut]/LHA-SPI/[Bulan Romawi]/[Tahun]`.
   - Kode Jenis Surat: `ST` (Surat Tugas), `PA` (Pemberitahuan Audit/Undangan), `DT` (Permintaan Data), `KF` (Konfirmasi), `TL` (Tindak Lanjut), `KS` (Konsultasi), `KP` (Korespondensi Eksternal), `UM` (Umum).
2. **Manajemen Surat Internal & Eksternal:**
   - **Surat Internal:** Mencatat Nomor Surat, Perihal, Ditujukan (Tujuan), Asal Surat, Tanggal, Sifat Kerahasiaan (`Biasa`, `Terbatas`, `Rahasia`, `Sangat Rahasia`), dan File Lampiran.
   - **Surat Eksternal:** Mencatat Nomor Surat, Perihal, Ditujukan, Asal Surat, Tanggal, File Lampiran, ditambah fitur khusus pelacakan **Status Follow-Up** (`Belum Tindak Lanjut`, `Dalam Proses`, `Selesai`) beserta catatan dan batas waktunya.
3. **Lembar Disposisi Digital:**
   - Manager SPI dapat memberikan disposisi langsung pada surat/laporan yang masuk.
   - Mencakup pilihan penerima disposisi (Auditor/Tim), derajat kecepatan (`Biasa`, `Segera`, `Kilat`), instruksi (`Ditindaklanjuti`, `Dibalas`, `DipelaJari`, `Diarsipkan`), tenggat waktu, dan pemantauan status penyelesaiannya.
4. **Manajemen Dokumen Master (SOP & Kebijakan):**
   - Lemari digital penyimpanan pedoman (Manual, SOP, Work Instruction, Formulir).
   - Penomoran standar: `[Kode Dept]-BSP/[Tipe]/[No.Urut]` (Contoh: `QHSE-BSP/SOP/001`).
   - Kontrol Status Otomatis: Dokumen aktif dilabeli **`TERKENDALI`**. Jika ada revisi versi baru, dokumen versi lama otomatis berpindah status menjadi **`KADALUARSA`** (disimpan di folder kadaluarsa dengan masa retensi 3 tahun) agar staf tidak salah menggunakan aturan lama.

### Modul 3: Manajemen Rapat & E-Notulen
- **Jadwal & Undangan Rapat:** Mencatat Tanggal & Waktu Rapat, Lokasi Rapat (Ruangan/Link Virtual), Perihal/Agenda yang dibahas, Jenis Rapat (`Entry Meeting`, `Exit Meeting`, `Rapat Internal SPI`, `Rapat Komite/Pimpinan`), dan Daftar Undangan/Peserta Rapat.
- **E-Notulen (Pencatatan Hasil Rapat):** Mencatat poin-poin pembahasan rapat dan hasil keputusan/tindak lanjut langsung di dalam sistem.
- **Keamanan Rapat:** Secara bawaan (default), notulen rapat memiliki sifat kerahasiaan **`Terbatas`** (hanya dapat diakses oleh personel SPI dan peserta rapat terkait).

## 4. Alur Kerja Sistem (End-to-End Workflow)
1. **Input:** Staf/Admin menginput surat atau Manager menjadwalkan rapat -> Sistem memberikan nomor otomatis (untuk surat keluar) dan mengunci hak akses berdasarkan tingkat kerahasiaan.
2. **Proses & Disposisi:** Surat masuk atau hasil keputusan rapat diteruskan menjadi instruksi (Disposisi) oleh Manager kepada Auditor dengan tenggat waktu.
3. **Tindak Lanjut (Follow-Up):** Auditor atau Auditee mengunggah bukti penyelesaian/tanggapan pada surat eksternal atau disposisi.
4. **Pengarsipan:** Dokumen yang selesai diproses tersimpan permanen di arsip elektronik dengan penamaan baku dan dapat dicari melalui fitur *Global Search* dan *Filter*.