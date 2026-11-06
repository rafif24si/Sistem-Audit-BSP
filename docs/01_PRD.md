# Product Requirements Document (PRD) - Sistem Integrasi SPI PT Bumi Siak Pusako

## 1. Ringkasan Proyek
- **Nama Aplikasi:** Sistem Integrasi SPI (Satuan Pengawasan Intern) PT Bumi Siak Pusako.
- **Bentuk Aplikasi:** Aplikasi Web Internal berbentuk Dashboard Admin (Bukan Landing Page publik).
- **Masalah Utama:** Pengelolaan dokumen pedoman (SOP), pencatatan surat masuk/keluar, pemantauan disposisi, serta pendataan jadwal dan notulen rapat petinggi audit masih terpisah-pisah dan belum terstandarisasi secara digital.
- **Solusi:** Membangun platform terpusat berbasis web untuk mengintegrasikan Kontrol Dokumen (Persuratan, Disposisi, Arsip SOP) dan Manajemen Rapat (Jadwal & E-Notulen) dalam satu ekosistem yang aman dan terlacak.

## 2. Peran Pengguna (User Roles & Hak Akses)
1. **Super Admin (Pengelola Dokumen SPI / IT):** Memiliki akses penuh dan mutlak ke seluruh modul dan data. Satu-satunya peran yang berhak membuat/mendaftarkan akun pengguna baru, mengelola semua data master (Departemen, Pegawai, Jenis Rapat, Ruangan Rapat, Platform Rapat, Periode KPI), dan memantau Log Aktivitas.
2. **Manager SPI (Kepala Audit):** Melihat statistik dashboard, membuat jadwal rapat, memberikan instruksi disposisi pada surat masuk, dan memberikan persetujuan (approval) pada surat keluar atau laporan.
3. **Auditor / Staf SPI:** Menginput konsep surat keluar, mencatat notulen hasil rapat, menindaklanjuti instruksi disposisi dari Manager, dan mengakses dokumen terkendali.
4. **Auditee (PIC Departemen Terkait):** Hanya dapat melihat surat/undangan yang ditujukan ke departemennya, melihat notulen rapat terkait (entry/exit meeting), dan mengunggah dokumen tindak lanjut (follow-up).

### Matriks Otorisasi & Manajemen Hak Akses Dinamis:
- **Kelola Pengguna (`/users`):** Berfungsi murni untuk manajemen identitas (Tambah/Edit/Hapus Akun, Reset Password, assign Departemen).
- **Kelola Hak Akses & PJS (`/permissions`):** Halaman khusus bagi Super Admin untuk mengatur otoritas *Role-Based Access Control* (RBAC) secara spesifik.
  - **Matriks CRUD:** Menggunakan tampilan matriks tabel (Modul vs Create/Read/Update/Delete) untuk memetakan hak akses spesifik per pengguna.
  - **Proteksi Data Master:** Akses terhadap "Pengaturan Data Master" adalah wewenang mutlak Super Admin. Opsi Data Master **tidak dimunculkan** dalam Matriks CRUD untuk peran lain demi mencegah modifikasi ilegal.
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

### Modul 1: Autentikasi, Kelola Pengguna, Dashboard, & Navigasi (UI/UX)
- **Login & Validasi Akun:** 
  - Form Login diamankan dengan Captcha. 
  - **Validasi Akun Nonaktif:** Sistem akan memblokir proses login jika akun pengguna berstatus dinonaktifkan (*soft deleted*), dan mengembalikan pesan error yang sesuai.
- **Manajemen Pengguna & Visualisasi:** Super Admin dapat mengelola akun (`/users`). Pengguna yang dinonaktifkan tetap tampil di tabel demi menjaga riwayat data, namun diberikan penanda visual yang jelas (misal: baris/teks berwarna merah atau redup).
- **Antarmuka & Navigasi Cerdas:**
  - **Search Menu:** Sidebar dilengkapi fitur pencarian menu agar pengguna dapat menemukan halaman dengan cepat.
  - - **Badge & Dropdown Notifikasi Interaktif:** Terdapat indikator angka (badge) notifikasi belum dibaca di Topbar. 
    - **Itemized & Actionable:** Dropdown tidak boleh hanya menampilkan ringkasan angka (misal: "2 Surat Masuk"). Notifikasi harus dirinci per item dokumen/rapat secara spesifik (Contoh: "Surat 045/SPI/.. membutuhkan Disposisi", "Jadwal Rapat Entry Meeting diubah").
    - **Clickable:** Setiap item notifikasi dapat diklik dan akan mengarahkan pengguna langsung ke tautan (URL) dokumen atau rapat yang bersangkutan.
    - **Visual Unread/Read:** Item notifikasi yang belum dibaca memiliki perbedaan visual (misal: *background* warna berbeda atau teks tebal) dibandingkan yang sudah dibaca. Dilengkapi tombol "Tandai Semua Dibaca" (*Mark all as read*).
    - **Timestamp:** Menampilkan waktu notifikasi dengan format ramah manusia (*human-readable*, misal: "2 jam yang lalu").
  - **Format Tanggal UI:** Seluruh daftar/tabel dalam sistem harus merender *timestamp* (ISO 8601) menjadi format tanggal lokal yang ramah baca (`dd/mm/yyyy` atau `dd/mm/yyyy s/d dd/mm/yyyy` untuk rentang hari), tanpa menghilangkan informasi jam jika dibutuhkan.
- **Manajemen Data Master (Khusus Super Admin):** Mengelola referensi statis untuk mencegah kesalahan ketik (*typo*), meliputi:
  - **Master Pegawai:** Daftar seluruh pegawai PT BSP (Nama, Email, Departemen) sebagai referensi global pengiriman undangan, terpisah dari tabel akun pengguna yang bisa login.
  - **Master Departemen:** Unit kerja yang ada di PT BSP.
  - **Master Ruang Rapat:** Lokasi fisik rapat yang bisa dipilih.
  - **Master Platform Rapat:** Platform virtual online (Zoom, Meet, Webex) yang bersifat dinamis.
  - **Master Jenis Rapat & Kategori KPI.**
  - **Master Periode KPI:** Daftar Tahun capaian (misal: 2024, 2025, 2026).
- **Dashboard Utama:** Menampilkan ringkasan statistik (Dokumen Terkendali, Surat Eksternal Butuh Follow-Up, Jadwal Rapat).
- **Log Aktivitas & Audit Trail Canggih:** 
  - Merekam setiap mutasi data (Siapa, Apa, Kapan).
  - **Komparasi Data (Old vs New):** Menyediakan jendela pop-up/modal untuk membandingkan secara detail nilai sebelum (*old_value*) dan sesudah diubah (*new_value*).
  - **Null Handling:** Jika nilai lama tidak ada, sistem akan menampilkan keterangan manusiawi (misal: "Nilai sebelumnya tidak ada").
  - **Humanisasi Aksi:** Mengubah nama aksi teknis/mesin menjadi bahasa yang ramah dibaca manusia (misal: `Memperbarui Data Pengguna`).

### Modul 2: Dokumen Kontrol & Persuratan
1. **Penomoran Surat Otomatis (Auto-Numbering):**
   - Surat Keluar di-*generate* baku HANYA setelah disetujui (Approved) oleh Manager SPI (Contoh: `045/SPI/ST/X/2026`).
   - Nomor Surat Eksternal Masuk di-input secara MANUAL dari dokumen aslinya.
2. **Manajemen Surat & Filter Tahun:**
   - **Filter Histori:** Daftar Surat Internal dan Eksternal dilengkapi dengan fitur **Filter Tahun** agar arsip lama mudah dicari tanpa *scroll* berlebihan. Tahun ditarik dinamis dari kolom `letter_date`, bukan di-*hardcode* dari UI.
   - **Kewajiban Lampiran:** Pengguna **wajib** mengunggah file lampiran untuk menyimpan data Surat baru.
   - **Tingkat Kerahasiaan (Access Security):** Opsi `Biasa`, `Terbatas`, `Rahasia`, dan `Sangat Rahasia`.
   - **Alur Approval Surat Keluar:** Konsep surat `pending_approval` menunggu Manager SPI (atau Super Admin) untuk `approved` (Disetujui) atau `rejected` (Revisi).
3. **Lembar Disposisi Digital:**
   - Manager SPI mendelegasikan instruksi (`Ditindaklanjuti`, `Dibalas`, dsb) pada surat masuk dengan derajat kecepatan dan batas waktu tertentu.
   - **Filter Tahun:** Dilengkapi dengan fitur dropdown Filter Tahun (mengacu pada histori).
4. **Manajemen Dokumen Master (SOP & Kebijakan):**
   - Perpustakaan digital pedoman perusahaan.
   - **Versi Otomatis:** Sistem memberikan penomoran versi berurut (`01`, `02`, dst). Revisi baru akan otomatis mengubah status versi lama dari `TERKENDALI` menjadi `KADALUARSA` (arsip).

### Modul 3: Manajemen Rapat & E-Notulen
- **Jadwal & Undangan Rapat:** 
  - **Filter Tahun:** Dilengkapi *dropdown* Filter Tahun berdasarkan `meeting_date_start`.
  - Menggunakan Tanggal Mulai dan Tanggal Selesai (bisa untuk rapat multi-hari).
  - Mode Rapat `Offline` mengambil dinamis dari Master Ruangan, sedangkan `Online` mengambil dari Master Platform Meeting.
  - **Input Peserta Terintegrasi Master Pegawai:** Form pendaftaran audiens terintegrasi langsung dengan Master Data Pegawai. Pengguna cukup memilih nama dari *dropdown*, dan email otomatis masuk ke daftar undangan (*tag email*).
  - **Dukungan Tamu Eksternal:** Fitur *Dynamic Tag Email* (ketik bebas) tetap dipertahankan HANYA untuk menambahkan tamu luar/eksternal yang tidak ada di Master Pegawai.
  - **Siklus Status Rapat:** Otomatis berstatus `Terjadwal` saat dibuat, dan harus diubah menjadi `Selesai` setelah rapat usai. Field "Berlangsung" ditiadakan.
- **E-Notulen (Pencatatan Hasil Rapat & Unduh PDF Resmi):**
  - Form notulen HANYA BISA diakses/diinput setelah rapat berstatus `Selesai`.
  - **Keamanan Rapat (Kerahasiaan):** Menggunakan tingkat kerahasiaan `Biasa`, `Terbatas (Bawaan SPI)`, dan `Rahasia`.
  - **Unduh PDF Ber-Kop Surat:** Fitur cetak E-Notulen resmi ber-kop perusahaan PT Bumi Siak Pusako secara rapi (mencakup logo, identitas BUMD, dan alamat kantor).

### Modul 4: Pencatatan Indikator Kinerja Kunci (KPI) Fleksibel
- **Pencatatan Target & Realisasi KPI SPI:** Memungkinkan Manager SPI mencatat dan mengevaluasi target indikator kinerja (merujuk sistem KPI perusahaan).
- **Struktur Data Master:** Kategori KPI dan **Periode/Tahun KPI** wajib ditarik dari Master Data agar seragam dan bebas *typo*. 
- **Fitur Pembaruan (*Update Progress*):** Pimpinan bisa merekam pembaruan pencatatan persentase, mengunggah file bukti kinerja (*evidence*), dan mengetik catatan. Bar capaian di Dashboard terisi otomatis seiring pergerakan nilai `realization_value`. Polarisasi (*Positive/Negative*) menentukan arah sukses target.
- **Filter Tahun & Report Summary:** Tampilan default menyajikan KPI tahun berjalan, dilengkapi *Dropdown Filter* untuk melihat data tahun mundur (*back-date*). Terdapat tombol khusus untuk meng-generate/melihat laporan ringkasan (**Report Summary**) dari seluruh pencapaian KPI.

## 4. Alur Kerja Sistem (End-to-End Workflow)
1. **Input & Approval:** Staf/Auditor menginput konsep surat atau Manager menjadwalkan rapat (Offline/Online) -> Manager SPI menyetujui surat keluar -> Sistem mengunci nomor otomatis dan mengatur hak akses berdasarkan tingkat kerahasiaan serta departemen tujuan.
2. **Proses & Disposisi:** Surat masuk atau hasil keputusan rapat diteruskan menjadi instruksi (Disposisi) oleh Manager kepada Auditor dengan tenggat waktu.
3. **Tindak Lanjut (Follow-Up):** Auditor menindaklanjuti disposisi, sedangkan Auditee mengunggah bukti penyelesaian/tanggapan pada surat eksternal yang ditujukan ke departemennya.
4. **Pengarsipan & Cetak:** Dokumen dan E-Notulen yang selesai diproses tersimpan permanen di arsip elektronik sistem, dapat diunduh sebagai PDF resmi ber-kop surat, dan dapat dicari melalui fitur *Global Search* dan *Filter*.