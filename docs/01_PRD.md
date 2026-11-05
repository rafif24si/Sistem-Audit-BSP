# Product Requirements Document (PRD) - Sistem Integrasi SPI PT Bumi Siak Pusako

## 1. Ringkasan Proyek
- **Nama Aplikasi:** Sistem Integrasi SPI (Satuan Pengawasan Intern) PT Bumi Siak Pusako.
- **Bentuk Aplikasi:** Aplikasi Web Internal berbentuk Dashboard Admin (Bukan Landing Page publik).
- **Masalah Utama:** Pengelolaan dokumen pedoman (SOP), pencatatan surat masuk/keluar, pemantauan disposisi, serta pendataan jadwal dan notulen rapat petinggi audit masih terpisah-pisah dan belum terstandarisasi secara digital.
- **Solusi:** Membangun platform terpusat berbasis web untuk mengintegrasikan Kontrol Dokumen (Persuratan, Disposisi, Arsip SOP) dan Manajemen Rapat (Jadwal & E-Notulen) dalam satu ekosistem yang aman dan terlacak.

## 2. Peran Pengguna (User Roles & Hak Akses)
1. **Super Admin (Pengelola Dokumen SPI / IT):** Memiliki akses penuh dan mutlak ke seluruh modul dan data. Satu-satunya peran yang berhak membuat/mendaftarkan akun pengguna baru, mengelola semua data master (Departemen, Jenis Rapat, Ruangan Rapat, Kategori KPI), dan memantau Log Aktivitas.
2. **Manager SPI (Kepala Audit):** Melihat statistik dashboard, membuat jadwal rapat, memberikan instruksi disposisi pada surat masuk, dan memberikan persetujuan (approval) pada surat keluar atau laporan.
3. **Auditor / Staf SPI:** Menginput konsep surat keluar, mencatat notulen hasil rapat, menindaklanjuti instruksi disposisi dari Manager, dan mengakses dokumen terkendali.
4. **Auditee (PIC Departemen Terkait):** Hanya dapat melihat surat/undangan yang ditujukan ke departemennya, melihat notulen rapat terkait (entry/exit meeting), dan mengunggah dokumen tindak lanjut (follow-up).

### Matriks Otorisasi & Manajemen Hak Akses Dinamis:
- **Kelola Pengguna (`/users`):** Berfungsi murni untuk manajemen identitas (Tambah/Edit/Hapus Akun, Reset Password, assign Departemen).
- **Kelola Hak Akses & PJS (`/permissions`):** Halaman khusus bagi Super Admin untuk mengatur otoritas *Role-Based Access Control* (RBAC) secara spesifik.
  - **Matriks CRUD:** Menggunakan tampilan matriks tabel (Modul vs Create/Read/Update/Delete) untuk memetakan hak akses spesifik per pengguna.
  - **PJS (Penanggung Jawab Sementara):** Fitur untuk mendelegasikan wewenang manajerial (misal: Approval Surat, Disposisi) kepada staf biasa dalam rentang waktu tertentu (Start Date - End Date) tanpa mengubah role permanennya.
- **Dokumen Master SOP (`/documents`):** Hanya `super_admin` yang boleh Tambah, Ubah, dan Hapus (CRUD). Role `manager_spi`, `auditor`, dan `auditee` HANYA boleh melihat daftar dan mengunduh dokumen (Read & Download Only; tombol CRUD wajib disembunyikan dan diblokir di backend).
- **Surat Internal & Eksternal (`/letters`):**
  - Pemisahan tegas: Surat Internal (surat menyurat dalam perusahaan) dan Surat Eksternal (surat keluar/masuk dari instansi luar, tidak memiliki akses sistem).
  - `super_admin` & `auditor`: Dapat mencatat/membuat konsep surat dan mengelola persuratan. **Wajib melampirkan file dokumen/pdf**.
  - `manager_spi`: Melihat seluruh surat dan memiliki tombol khusus untuk **Menyetujui (`approved`) / Menolak (`rejected`)** konsep surat keluar.
  - `auditee`: DILARANG membuat, mengubah, atau menghapus surat (sembunyikan tombol Catat Surat, Ubah, Hapus, dan blokir di backend). Query daftar surat untuk `auditee` wajib difilter agar **hanya menampilkan surat yang ditujukan ke departemennya**. `auditee` hanya diizinkan mengisi form **Follow-Up** pada surat eksternal yang ditujukan ke departemennya.
- **Lembar Disposisi (`/dispositions`):** Hanya `manager_spi` dan `super_admin` yang dapat menerbitkan disposisi baru (proteksi UI dan Backend `DispositionController@store`). Terdapat opsi **Derajat Kecepatan** (Biasa, Segera, Kilat) untuk mengatur prioritas kerja. `auditor` hanya memperbarui status tindak lanjut disposisi yang ditugaskan kepadanya.
- **Manajemen Rapat & E-Notulen (`/meetings`):** Hanya `manager_spi` dan `super_admin` yang dapat menjadwalkan, mengubah, dan menghapus rapat. `auditor` dapat mengisi/mengedit E-Notulen HANYA JIKA status rapat sudah diubah menjadi 'Selesai'. `auditee` hanya dapat melihat jadwal, membaca E-Notulen secara *read-only* jika diundang (tombol Jadwalkan Rapat, Ubah, dan Hapus disembunyikan dan diblokir di backend).

## 3. Spesifikasi Modul & Fitur Utama (MVP)

### Modul 1: Autentikasi, Kelola Pengguna, Dashboard & Log Aktivitas
- **Login & Akun:** Hanya tersedia form Login (Email & Password). TIDAK ADA fitur Register karena sistem bersifat internal. Fitur keamanan diaktifkan menggunakan Cloudflare Turnstile Captcha pada halaman Login. Akun default untuk keperluan *testing* akan dibuat menggunakan Seeder dengan kredensial:
  - Super Admin: `superadmin@bsp.com` (pass: password)
  - Manager SPI: `manager@bsp.com` (pass: password)
  - Auditor: `auditor@bsp.com` (pass: password)
  - Auditee QHSE: `auditee.qhse@bsp.com` (pass: password)
- **Manajemen Pengguna (User Management - Khusus Super Admin):** Halaman khusus bagi Super Admin (`/users`) untuk melihat daftar pengguna, mendaftarkan akun baru (Nama, Email, Password, Role, dan Departemen), mengubah data akun, serta menghapus/menonaktifkan pengguna.
- **Manajemen Data Master (Khusus Super Admin):** Super Admin memiliki kontrol untuk menambah, mengubah, atau menghapus referensi data utama yang digunakan di seluruh form, mencakup:
  - **Master Departemen:** Unit kerja yang ada di PT BSP.
  - **Master Ruang Rapat:** Lokasi fisik rapat yang bisa dipilih.
  - **Master Jenis Rapat:** Kategori pertemuan audit.
  - **Master Kategori KPI:** Area fokus penilaian kinerja.
- **Dashboard Utama:** Menampilkan kartu ringkasan statistik (Total Dokumen Terkendali, Surat Masuk Belum Didisposisi, Surat Eksternal Butuh Follow-Up, dan Jadwal Rapat Terdekat) serta tabel aktivitas terbaru yang menggabungkan aktivitas dokumen dan rapat.
- **Log Aktivitas (Audit Trail):** Sistem merekam setiap mutasi data penting yang dilakukan pengguna. Log mencatat 'Siapa' yang melakukan 'Apa' pada 'Kapan', dan wajib mencatat detail spesifik perubahan, seperti **nilai lama (*old value*) dan nilai baru (*new value*)**. Contoh aktivitas yang direkam: Login, mengubah status dokumen, mengunggah revisi file SOP, menyetujui surat, dsb.

### Modul 2: Dokumen Kontrol & Persuratan
1. **Penomoran Surat Otomatis (Auto-Numbering):**
   - Menghilangkan buku agenda fisik. Saat staf membuat Surat Keluar atau Laporan, sistem otomatis membuat nomor baku HANYA setelah disetujui (Approved) oleh Manager SPI.
   - Format Surat Keluar: `[No.Urut]/SPI/[Kode Jenis]/[Bulan Romawi]/[Tahun]` (Contoh: `045/SPI/ST/X/2026`).
   - Format Laporan Hasil Audit: `[No.Urut]/LHA-SPI/[Bulan Romawi]/[Tahun]`.
   - Nomor Surat Eksternal Masuk di-input secara MANUAL dari lembar dokumen fisiknya.
2. **Manajemen Surat Internal, Surat Eksternal & Approval Surat Keluar:**
   - **Kewajiban Lampiran:** Pengguna **wajib** mengunggah file lampiran untuk menyimpan data Surat Internal maupun Surat Eksternal yang baru dibuat.
   - **Tingkat Kerahasiaan (Access Security):** Opsi seperti `Biasa`, `Terbatas`, `Rahasia`, dan `Sangat Rahasia` menentukan siapa saja yang bisa melihat/mendownload surat tersebut.
   - **Surat Internal:** Mencatat Nomor Surat, Perihal, Ditujukan (Tujuan & Departemen Tujuan), Asal Surat, Tanggal, Sifat Kerahasiaan, dan File Lampiran.
   - **Surat Eksternal:** Mencatat Nomor Surat, Perihal, Ditujukan (Tujuan & Departemen Tujuan), Asal Surat, Tanggal, File Lampiran, ditambah fitur khusus pelacakan **Status Follow-Up** (`Belum Tindak Lanjut`, `Dalam Proses`, `Selesai`) beserta catatan dan batas waktunya (hanya dapat diisi oleh Auditee departemen terkait atau SPI).
   - **Alur Approval Surat Keluar:** Konsep surat keluar yang diinput oleh Auditor memiliki status persetujuan `pending_approval`. Manager SPI (atau Super Admin) melakukan verifikasi untuk mengubah status menjadi `approved` (Disetujui) atau `rejected` (Ditolak/Revisi beserta catatan).
3. **Lembar Disposisi Digital:**
   - Manager SPI dapat memberikan disposisi langsung pada surat/laporan yang masuk.
   - Mencakup pilihan penerima disposisi (Auditor/Tim), derajat kecepatan (`Biasa`, `Segera`, `Kilat`), instruksi (`Ditindaklanjuti`, `Dibalas`, `DipelaJari`, `Diarsipkan`), tenggat waktu, dan pemantauan status penyelesaiannya.
4. **Manajemen Dokumen Master (SOP & Kebijakan):**
   - Lemari digital (Perpustakaan Kriteria Audit) yang menyimpan pedoman (Manual, SOP, Work Instruction, Formulir) dari seluruh departemen PT BSP yang dikelola oleh Super Admin. Penting untuk auditor memiliki acuan (kriteria) yang jelas dan mutakhir.
   - Penomoran standar: `[Kode Dept]-BSP/[Tipe]/[No.Urut]` (Contoh: `QHSE-BSP/SOP/001`).
   - **Versi Otomatis:** Saat penambahan dokumen baru, sistem secara otomatis memberikan versi (dimulai dari `01`). Input manual versi pada form ditiadakan.
   - Kontrol Status Otomatis (Version Control): Dokumen aktif dilabeli **`TERKENDALI`**. Jika ada revisi versi baru yang ditambahkan, dokumen versi lama otomatis berpindah status menjadi **`KADALUARSA`** (disimpan di folder arsip dengan masa retensi 3 tahun) agar staf tidak salah menggunakan aturan lama.

### Modul 3: Manajemen Rapat & E-Notulen
- **Jadwal & Undangan Rapat:** Mencatat Tanggal & Waktu Rapat, Lokasi Rapat (Ruangan/Link Virtual), Perihal/Agenda yang dibahas, Jenis Rapat (Dropdown dari Master Data), dan Daftar Undangan/Peserta Rapat (hanya dapat dibuat/diubah/dihapus oleh Manager SPI & Super Admin).
  - Sistem tidak menggunakan field 'Berlangsung' yang membingungkan. Gunakan Tanggal Mulai dan Tanggal Selesai.
  - **Fitur Tambahan Mode Pelaksanaan Rapat (`Offline` vs `Online`):**
    - Saat menjadwalkan rapat, terdapat pilihan **Mode Rapat**: `Offline` atau `Online`.
    - Jika memilih **`Offline`**: Form menampilkan *dropdown* **Ruangan Rapat Fisik** yang bersumber dari tabel Master `meeting_rooms`. (Jika belum ada master ruangan, berikan *input dropdown dinamis* sementara).
    - Jika memilih **`Online`**: Form otomatis menampilkan pilihan dropdown **Platform Meeting** (`Zoom`, `Google Meet`, `Microsoft Teams`, `Webex`) dan kolom lokasi digunakan untuk memasukkan tautan/link meeting.
  - **Input Peserta & Notifikasi Email Otomatis:** Form pendaftaran peserta menggunakan input **Dynamic Tag Email** yang menerima alamat email secara bebas. Saat jadwal rapat berhasil disimpan, sistem akan mengirimkan email undangan resmi ke seluruh alamat email.
  - **Siklus Status Rapat (Best Practice):** Rapat yang baru dibuat otomatis berstatus `Terjadwal`. Saat diubah menjadi status `Selesai` secara otomatis ketika notulen rapat sudah terisi dan dokumen pendukung selesai di-upload (Notifikasi email undangan baru TIDAK dikirim lagi ketika status `Selesai`).
- **E-Notulen (Pencatatan Hasil Rapat & Unduh PDF Resmi):**
  - Mencatat dan menyimpan poin-poin pembahasan rapat serta hasil keputusan/tindak lanjut langsung di dalam sistem (dapat diisi oleh Auditor, Manager SPI, dan Super Admin) HANYA JIKA status rapat sudah berada di `Selesai`.
  - **Keamanan Rapat (Kerahasiaan):** Sistem memiliki tingkat kerahasiaan `Biasa`, `Terbatas (Bawaan SPI)`, dan `Rahasia` untuk hasil notulen. `Terbatas` berarti notulen hanya dapat diakses oleh karyawan SPI dan pihak departemen yang secara spesifik diundang dalam agenda tersebut. `Rahasia` berarti hanya SPI tingkat eksekutif.
  - **Fitur Tambahan Unduh PDF Ber-Kop Surat:** Selain disimpan di dalam sistem, halaman E-Notulen dilengkapi tombol **"Unduh PDF"** untuk mengekspor dan mengunduh dokumen notulen resmi berformat PDF yang memuat **Kop Surat Resmi PT Bumi Siak Pusako**.
    - **Logo Perusahaan:** Logo resmi PT Bumi Siak Pusako (`public/images/logo.png`).
    - **Nama Badan Usaha:** **PT BUMI SIAK PUSAKO**
    - **Keterangan Usaha / Status:** Badan Usaha Milik Daerah (BUMD) – Pengelola Wilayah Kerja Coastal Plain Pekanbaru (WK CPP) / Satuan Pengawasan Intern (SPI).
    - **Alamat & Kontak Resmi pada Kop:**
      - Kantor Pusat (Pekanbaru): Gedung Surya Dumai Lt. 4, 6, dan 8, Jl. Jend. Sudirman Utama / No. 395, Pekanbaru, Riau 28116
      - Kantor Jakarta: JB Tower Lt. 15, Jl. Kebon Sirih No. 48–50, Jakarta Pusat
      - Camp Operasional: Camp Zamrud, Kabupaten Siak, Provinsi Riau
      - Telepon & Faksimili: (62-761) 855-764 | Email Resmi: helpdesk@bsp.co.id | Situs Web: ptbsp.id / bsp.co.id

### Modul 4: Pencatatan Indikator Kinerja Kunci (KPI) Fleksibel
- **Pencatatan Target & Realisasi KPI SPI:** Memungkinkan Manager SPI dan Super Admin untuk mencatat, memperbarui, dan mengevaluasi target indikator kinerja yang merujuk pada sistem penilaian di perusahaan saat ini.
- **Fleksibilitas Data:** Data nama indikator, kategori KPI (Dropdown dari Master Data), target capaian, realisasi capaian, satuan ukur (%, Hari, Dokumen, Kegiatan), periode (tahun/triwulan), status (Tercapai, Dalam Proses, Perlu Perhatian, Belum Tercapai), polarisasi pergerakan (semakin besar semakin baik / makin kecil makin baik), serta catatan evaluasi dapat disesuaikan dan diedit kapan saja secara fleksibel.
- **Fitur Pembaruan (*Update Progress*):** KPI tidak statis. Pimpinan bisa merekam pembaruan mingguan atau bulanan berupa pencatatan persentase, mengunggah file bukti kinerja (*evidence*), dan mengetik catatan. Bar capaian di dalam Dashboard akan terisi otomatis seiring nilai `realization_value` naik.
- **Visualisasi & Hak Akses:** Ditampilkan secara interaktif di Dashboard utama (dengan kartu progres persentase capaian) dan modul terintegrasi; Manager SPI & Super Admin dapat menambah/mengubah data KPI, sedangkan Auditor & Auditee dapat melihat data secara *read-only*.

## 4. Alur Kerja Sistem (End-to-End Workflow)
1. **Input & Approval:** Staf/Auditor menginput konsep surat atau Manager menjadwalkan rapat (Offline/Online) -> Manager SPI menyetujui surat keluar -> Sistem mengunci nomor otomatis dan mengatur hak akses berdasarkan tingkat kerahasiaan serta departemen tujuan.
2. **Proses & Disposisi:** Surat masuk atau hasil keputusan rapat diteruskan menjadi instruksi (Disposisi) oleh Manager kepada Auditor dengan tenggat waktu.
3. **Tindak Lanjut (Follow-Up):** Auditor menindaklanjuti disposisi, sedangkan Auditee mengunggah bukti penyelesaian/tanggapan pada surat eksternal yang ditujukan ke departemennya.
4. **Pengarsipan & Cetak:** Dokumen dan E-Notulen yang selesai diproses tersimpan permanen di arsip elektronik sistem, dapat diunduh sebagai PDF resmi ber-kop surat, dan dapat dicari melalui fitur *Global Search* dan *Filter*.