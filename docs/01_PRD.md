# Product Requirements Document (PRD) - Sistem Integrasi SPI PT Bumi Siak Pusako

## 1. Ringkasan Proyek
- **Nama Aplikasi:** Sistem Integrasi SPI (Satuan Pengawasan Intern) PT Bumi Siak Pusako.
- **Bentuk Aplikasi:** Aplikasi Web Internal berbentuk Dashboard Admin (Bukan Landing Page publik).
- **Masalah Utama:** Pengelolaan dokumen pedoman (SOP), pencatatan surat masuk/keluar, pemantauan disposisi, serta pendataan jadwal dan notulen rapat petinggi audit masih terpisah-pisah dan belum terstandarisasi secara digital.
- **Solusi:** Membangun platform terpusat berbasis web untuk mengintegrasikan Kontrol Dokumen (Persuratan, Disposisi, Arsip SOP) dan Manajemen Rapat (Jadwal & E-Notulen) dalam satu ekosistem yang aman dan terlacak.

## 2. Peran Pengguna (User Roles & Hak Akses)
1. **Super Admin (Pengelola Dokumen SPI / IT):** Memiliki akses penuh ke seluruh modul, memverifikasi penomoran surat, mengatur dokumen master, dan **satu-satunya peran yang berhak membuat/mendaftarkan akun pengguna baru**.
2. **Manager SPI (Kepala Audit):** Melihat statistik dashboard, membuat jadwal rapat, memberikan instruksi disposisi pada surat masuk, dan memberikan persetujuan (approval) pada surat keluar atau laporan.
3. **Auditor / Staf SPI:** Menginput konsep surat keluar, mencatat notulen hasil rapat, menindaklanjuti instruksi disposisi dari Manager, dan mengakses dokumen terkendali.
4. **Auditee (PIC Departemen Terkait):** Hanya dapat melihat surat/undangan yang ditujukan ke departemennya, melihat notulen rapat terkait (entry/exit meeting), dan mengunggah dokumen tindak lanjut (follow-up).

### Matriks Otorisasi Ketat per Modul (Backend & UI):
- **Kelola Pengguna (`/users`) & Log Aktivitas (`/activity-logs`):** Hanya `super_admin`. Role lain diblokir (`HTTP 403`) dan menu disembunyikan di Sidebar.
- **Dokumen Master SOP (`/documents`):** Hanya `super_admin` yang boleh Tambah, Ubah, dan Hapus (CRUD). Role `manager_spi`, `auditor`, dan `auditee` HANYA boleh melihat daftar dan mengunduh dokumen (Read & Download Only; tombol CRUD wajib disembunyikan dan diblokir di backend).
- **Surat Internal & Eksternal (`/letters`):**
  - `super_admin` & `auditor`: Dapat mencatat/membuat konsep surat dan mengelola persuratan.
  - `manager_spi`: Melihat seluruh surat dan memiliki tombol khusus untuk **Menyetujui (`approved`) / Menolak (`rejected`)** konsep surat keluar.
  - `auditee`: DILARANG membuat, mengubah, atau menghapus surat (sembunyikan tombol Catat Surat, Ubah, Hapus, dan blokir di backend). Query daftar surat untuk `auditee` wajib difilter agar **hanya menampilkan surat yang ditujukan ke departemennya**. `auditee` hanya diizinkan mengisi form **Follow-Up** pada surat eksternal yang ditujukan ke departemennya.
- **Lembar Disposisi (`/dispositions`):** Hanya `manager_spi` dan `super_admin` yang dapat menerbitkan disposisi baru (proteksi UI dan Backend `DispositionController@store`). `auditor` hanya memperbarui status tindak lanjut disposisi yang ditugaskan kepadanya.
- **Manajemen Rapat & E-Notulen (`/meetings`):** Hanya `manager_spi` dan `super_admin` yang dapat menjadwalkan, mengubah, dan menghapus rapat. `auditor` dapat mengisi/mengedit E-Notulen. `auditee` hanya dapat melihat jadwal, membaca E-Notulen secara *read-only*, serta mengunduh PDF E-Notulen khusus pada rapat di mana mereka diundang (tombol Jadwalkan Rapat, Ubah, dan Hapus disembunyikan dan diblokir di backend).

## 3. Spesifikasi Modul & Fitur Utama (MVP)

### Modul 1: Autentikasi, Kelola Pengguna & Dashboard Terintegrasi
- **Login & Akun: Hanya tersedia form Login (Email & Password). TIDAK ADA fitur Register karena sistem bersifat internal. Fitur keamanan diaktifkan menggunakan Cloudflare Turnstile Captcha pada halaman Login. Akun default untuk keperluan *testing* akan dibuat menggunakan Seeder dengan kredensial:
  - Super Admin: `superadmin@bsp.com` (pass: password)
  - Manager SPI: `manager@bsp.com` (pass: password)
  - Auditor: `auditor@bsp.com` (pass: password)
  - Auditee QHSE: `auditee.qhse@bsp.com` (pass: password)
- **Manajemen Pengguna (User Management - Khusus Super Admin):** Halaman khusus bagi Super Admin (`/users`) untuk melihat daftar pengguna, mendaftarkan akun baru (Nama, Email, Password, Role, dan Departemen), mengubah data akun, serta menghapus/menonaktifkan pengguna.
- **Dashboard Utama:** Menampilkan kartu ringkasan statistik (Total Dokumen Terkendali, Surat Masuk Belum Didisposisi, Surat Eksternal Butuh Follow-Up, dan Jadwal Rapat Terdekat) serta tabel aktivitas terbaru yang menggabungkan aktivitas dokumen dan rapat.

### Modul 2: Dokumen Kontrol & Persuratan
1. **Penomoran Surat Otomatis (Auto-Numbering):**
   - Menghilangkan buku agenda fisik. Saat staf membuat Surat Keluar atau Laporan, sistem otomatis membuat nomor baku:
   - Format Surat Keluar: `[No.Urut]/SPI/[Kode Jenis]/[Bulan Romawi]/[Tahun]` (Contoh: `045/SPI/ST/X/2026`).
   - Format Laporan Hasil Audit: `[No.Urut]/LHA-SPI/[Bulan Romawi]/[Tahun]`.
   - Kode Jenis Surat: `ST` (Surat Tugas), `PA` (Pemberitahuan Audit/Undangan), `DT` (Permintaan Data), `KF` (Konfirmasi), `TL` (Tindak Lanjut), `KS` (Konsultasi), `KP` (Korespondensi Eksternal), `UM` (Umum).
2. **Manajemen Surat Internal, Surat Eksternal & Approval Surat Keluar:**
   - **Surat Internal:** Mencatat Nomor Surat, Perihal, Ditujukan (Tujuan & Departemen Tujuan), Asal Surat, Tanggal, Sifat Kerahasiaan (`Biasa`, `Terbatas`, `Rahasia`, `Sangat Rahasia`), dan File Lampiran.
   - **Surat Eksternal:** Mencatat Nomor Surat, Perihal, Ditujukan (Tujuan & Departemen Tujuan), Asal Surat, Tanggal, File Lampiran, ditambah fitur khusus pelacakan **Status Follow-Up** (`Belum Tindak Lanjut`, `Dalam Proses`, `Selesai`) beserta catatan dan batas waktunya (hanya dapat diisi oleh Auditee departemen terkait atau SPI).
   - **Alur Approval Surat Keluar:** Konsep surat keluar yang diinput oleh Auditor memiliki status persetujuan `pending_approval`. Manager SPI (atau Super Admin) melakukan verifikasi untuk mengubah status menjadi `approved` (Disetujui) atau `rejected` (Ditolak/Revisi beserta catatan).
3. **Lembar Disposisi Digital:**
   - Manager SPI dapat memberikan disposisi langsung pada surat/laporan yang masuk.
   - Mencakup pilihan penerima disposisi (Auditor/Tim), derajat kecepatan (`Biasa`, `Segera`, `Kilat`), instruksi (`Ditindaklanjuti`, `Dibalas`, `DipelaJari`, `Diarsipkan`), tenggat waktu, dan pemantauan status penyelesaiannya.
4. **Manajemen Dokumen Master (SOP & Kebijakan):**
   - Lemari digital penyimpanan pedoman (Manual, SOP, Work Instruction, Formulir) yang dikelola oleh Super Admin dan dapat diakses/diunduh oleh seluruh role.
   - Penomoran standar: `[Kode Dept]-BSP/[Tipe]/[No.Urut]` (Contoh: `QHSE-BSP/SOP/001`).
   - Kontrol Status Otomatis: Dokumen aktif dilabeli **`TERKENDALI`**. Jika ada revisi versi baru, dokumen versi lama otomatis berpindah status menjadi **`KADALUARSA`** (disimpan di folder kadaluarsa dengan masa retensi 3 tahun) agar staf tidak salah menggunakan aturan lama.

### Modul 3: Manajemen Rapat & E-Notulen
- **Jadwal & Undangan Rapat:** Mencatat Tanggal & Waktu Rapat, Lokasi Rapat (Ruangan/Link Virtual), Perihal/Agenda yang dibahas, Jenis Rapat (`Entry Meeting`, `Exit Meeting`, `Rapat Internal SPI`, `Rapat Komite/Pimpinan`), dan Daftar Undangan/Peserta Rapat (hanya dapat dibuat/diubah/dihapus oleh Manager SPI & Super Admin).
  - **Fitur Tambahan Mode Pelaksanaan Rapat (`Offline` vs `Online`):**
    - Saat menjadwalkan rapat, terdapat pilihan **Mode Rapat**: `Offline` atau `Online`.
    - Jika memilih **`Offline`**: Form langsung mengarahkan pengguna untuk mengetikkan nama ruangan/tempat pelaksanaan rapat pada kolom lokasi (tanpa dropdown platform).
    - Jika memilih **`Online`**: Form otomatis menampilkan pilihan dropdown **Platform Meeting** (`Zoom`, `Google Meet`, `Microsoft Teams, `Webex`eams`) dan kolom lokasi digunakan untuk memasukkan tautan/link meeting.
  -- **Input Peserta & Notifikasi Email Otomatis:** Form pendaftaran peserta menggunakan input **Dynamic Tag Email** yang menerima alamat email secara bebas. Saat jadwal rapat berhasil disimpan, sistem akan mengirimkan email undangan resmi ke seluruh alamat email.
  - **Pembaruan Jadwal & Kirim Ulang Email (Resend):** Jika terjadi perubahan jadwal (waktu, lokasi, atau agenda), pengguna dapat melakukan *Edit* pada rapat tersebut. Terdapat opsi "Kirim ulang notifikasi email" saat menyimpan perubahan, sehingga sistem akan mengirimkan email pemberitahuan revisi jadwal (`MeetingUpdatedMail`) kepada seluruh peserta tanpa harus membuat jadwal baru.
- **E-Notulen (Pencatatan Hasil Rapat & Unduh PDF Resmi):**
  - Mencatat dan menyimpan poin-poin pembahasan rapat serta hasil keputusan/tindak lanjut langsung di dalam sistem (dapat diisi oleh Auditor, Manager SPI, dan Super Admin).
  - **Fitur Tambahan Unduh PDF Ber-Kop Surat:** Selain disimpan di dalam sistem, halaman E-Notulen dilengkapi tombol **"Unduh PDF"** untuk mengekspor dan mengunduh dokumen notulen resmi berformat PDF yang memuat **Kop Surat Resmi PT Bumi Siak Pusako**:
    - **Logo Perusahaan:** Logo resmi PT Bumi Siak Pusako (`public/images/logo.png`).
    - **Nama Badan Usaha:** **PT BUMI SIAK PUSAKO**
    - **Keterangan Usaha / Status:** Badan Usaha Milik Daerah (BUMD) – Pengelola Wilayah Kerja Coastal Plain Pekanbaru (WK CPP) / Satuan Pengawasan Intern (SPI).
    - **Alamat & Kontak Resmi pada Kop:**
      - Kantor Pusat (Pekanbaru): Gedung Surya Dumai Lt. 4, 6, dan 8, Jl. Jend. Sudirman Utama / No. 395, Pekanbaru, Riau 28116
      - Kantor Jakarta: JB Tower Lt. 15, Jl. Kebon Sirih No. 48–50, Jakarta Pusat
      - Camp Operasional: Camp Zamrud, Kabupaten Siak, Provinsi Riau
      - Telepon & Faksimili: (62-761) 855-764 | Email Resmi: helpdesk@bsp.co.id | Situs Web: ptbsp.id / bsp.co.id
- **Keamanan Rapat:** Secara bawaan (default), notulen rapat memiliki sifat kerahasiaan **`Terbatas`** (hanya dapat diakses oleh personel SPI dan peserta rapat terkait; Auditee hanya melihat rapat yang mengundangnya secara *read-only*).

### Modul 4: Pencatatan Indikator Kinerja Kunci (KPI) Fleksibel
- **Pencatatan Target & Realisasi KPI SPI:** Memungkinkan Manager SPI dan Super Admin untuk mencatat, memperbarui, dan mengevaluasi target indikator kinerja (seperti persentase penyelesaian PKPT tahunan, tingkat tindak lanjut rekomendasi temuan audit/TLHP, kecepatan penerbitan LHA, kepatuhan dokumen terkendali SOP).
- **Fleksibilitas Data:** Data nama indikator, kategori KPI, target capaian, realisasi capaian, satuan ukur (%, Hari, Dokumen, Kegiatan), periode (tahun/triwulan), status (Tercapai, Dalam Proses, Perlu Perhatian, Belum Tercapai), serta catatan evaluasi dapat disesuaikan dan diedit kapan saja secara fleksibel.
- **Visualisasi & Hak Akses:** Ditampilkan secara interaktif di Dashboard utama (dengan kartu progres persentase capaian) dan modul terintegrasi; Manager SPI & Super Admin dapat menambah/mengubah data KPI, sedangkan Auditor & Auditee dapat melihat data secara *read-only*.

## 4. Alur Kerja Sistem (End-to-End Workflow)
1. **Input & Approval:** Staf/Auditor menginput konsep surat atau Manager menjadwalkan rapat (Offline/Online) -> Manager SPI menyetujui surat keluar -> Sistem mengunci nomor otomatis dan mengatur hak akses berdasarkan tingkat kerahasiaan serta departemen tujuan.
2. **Proses & Disposisi:** Surat masuk atau hasil keputusan rapat diteruskan menjadi instruksi (Disposisi) oleh Manager kepada Auditor dengan tenggat waktu.
3. **Tindak Lanjut (Follow-Up):** Auditor menindaklanjuti disposisi, sedangkan Auditee mengunggah bukti penyelesaian/tanggapan pada surat eksternal yang ditujukan ke departemennya.
4. **Pengarsipan & Cetak:** Dokumen dan E-Notulen yang selesai diproses tersimpan permanen di arsip elektronik sistem, dapat diunduh sebagai PDF resmi ber-kop surat, dan dapat dicari melalui fitur *Global Search* dan *Filter*.