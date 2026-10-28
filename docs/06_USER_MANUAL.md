# PANDUAN PENGGUNA & STANDAR OPERASIONAL PROSEDUR (SOP) APLIKASI
## SISTEM INTEGRASI SATUAN PENGAWASAN INTERN (SPI)
### PT BUMI SIAK PUSAKO (WK COASTAL PLAINS AND PEKANBARU)

---

## DAFTAR ISI
1. [INFORMASI DOKUMEN & IDENTITAS SISTEM](#1-informasi-dokumen--identitas-sistem)
2. [BAB I: PENDAHULUAN & GAMBARAN UMUM EKSEKUTIF](#bab-i-pendahuluan--gambaran-umum-eksekutif)
3. [BAB II: DAFTAR AKUN & MATRIKS HAK AKSES (RBAC)](#bab-ii-daftar-akun--matriks-hak-akses-rbac)
4. [BAB III: PANDUAN OPERASIONAL MODUL SISTEM (STEP-BY-STEP)](#bab-iii-panduan-operasional-modul-sistem-step-by-step)
   - [3.1 Akses Masuk & Keamanan Akun (Login + Captcha)](#31-akses-masuk--keamanan-akun-login--captcha)
   - [3.2 Dashboard Pengawasan Eksekutif](#32-dashboard-pengawasan-eksekutif)
   - [3.3 Modul Dokumen Kontrol (Master SOP, Pedoman, WI, & Form)](#33-modul-dokumen-kontrol-master-sop-pedoman-wi--form)
   - [3.4 Modul Persuratan SPI (Internal & Eksternal)](#34-modul-persuratan-spi-internal--eksternal)
   - [3.5 Modul Lembar Disposisi Digital](#35-modul-lembar-disposisi-digital)
   - [3.6 Modul Manajemen Rapat & E-Notulen Digital](#36-modul-manajemen-rapat--e-notulen-digital)
   - [3.7 Modul Log Jejak Audit (Audit Trail)](#37-modul-log-jejak-audit-audit-trail)
5. [BAB IV: STANDAR OPERASIONAL PROSEDUR (SOP) PENGGUNAAN SISTEM](#bab-iv-standar-operasional-prosedur-sop-penggunaan-sistem)
6. [BAB V: SKENARIO DEMO PRESENTASI MANAJEMEN (10-MINUTE GOLDEN PATH)](#bab-v-skenario-demo-presentasi-manajemen-10-minute-golden-path)
7. [BAB VI: TANYA JAWAB TEKNIS (FAQ) & TROUBLESHOOTING](#bab-vi-tanya-jawab-teknis-faq--troubleshooting)

---

## 1. INFORMASI DOKUMEN & IDENTITAS SISTEM
- **Nama Aplikasi:** Sistem Integrasi Pengawasan Intern (SPI PT Bumi Siak Pusako)
- **Versi Sistem:** 1.0.0 (Lolos Verifikasi Produksi)
- **Organisasi Pemilik:** Satuan Pengawasan Intern (SPI) - PT Bumi Siak Pusako
- **Teknologi Backend:** Laravel 12, MySQL Laragon, Eloquent ORM, Private File Storage
- **Teknologi Frontend:** React 19, Inertia.js, Tailwind CSS, Lucide Icons
- **Target Pengguna:** Direksi, Kepala SPI, Seluruh Auditor SPI, dan PIC Departemen Teraudit (Auditee).

---

## BAB I: PENDAHULUAN & GAMBARAN UMUM EKSEKUTIF

### 1.1 Latar Belakang
Sebagai BUMD pengelola hulu minyak dan gas di Wilayah Kerja *Coastal Plains and Pekanbaru* (WK CPP), PT Bumi Siak Pusako dituntut mengedepankan prinsip *Good Corporate Governance* (GCG), kepatuhan regulasi SKK Migas, serta implementasi Sistem Manajemen Anti Penyuapan (ISO 37001). Pengelolaan dokumen pedoman audit, persuratan dinas, instruksi disposisi pimpinan, dan notulen rapat audit yang sebelumnya terfragmentasi kini disatukan dalam satu platform terpadu dan terenkripsi.

### 1.2 Nilai Tambah & Fitur Kunci
1. **Single Source of Truth Dokumen Pedoman:** Pengendalian status otomatis (*TERKENDALI* vs *KADALUARSA*), memastikan seluruh personil selalu mengacu pada SOP versi termutakhir.
2. **Auto-Numbering Baku Persuratan:** Menghilangkan risiko penomoran ganda pada Surat Masuk/Keluar dan Laporan Hasil Audit (LHA) sesuai kaidah tata naskah dinas SPI PT BSP.
3. **Akuntabilitas Disposisi Digital:** Memastikan instruksi pimpinan memiliki tenggat waktu (*due date*), skala prioritas (*Kilat, Segera, Biasa*), serta bukti laporan penyelesaian yang terdokumentasi.
4. **E-Notulen Sah & Terbatas:** Risalah rapat *Entry/Exit Meeting* audit tersimpan aman dan hanya dapat diakses oleh peserta terdaftar, menghindari kebocoran informasi strategis.
5. **Jejak Audit Tanpa Celah (Activity Log):** Setiap penambahan, pengubahan, atau pengunduhan file terekam otomatis beserta alamat IP dan stempel waktu.
6. **Keamanan Dokumen Rahasia (Private Storage):** File berklasifikasi *Rahasia* atau *Sangat Rahasia* disimpan di luar folder publik dan diverifikasi izin unduhnya melalui controller backend.

---

## BAB II: DAFTAR AKUN & MATRIKS HAK AKSES (RBAC)

Sistem telah dilengkapi dengan akun contoh berbasis peran (*Role-Based Access Control*) yang siap digunakan langsung saat presentasi atau operasional.

### 2.1 Daftar Akun Siap Pakai
Seluruh akun di bawah ini menggunakan kata sandi bawaan: **`password`**

| Peran (Role) | Nama Pengguna | Alamat Email | Unit Kerja | Deskripsi Tugas |
| :--- | :--- | :--- | :--- | :--- |
| **`super_admin`** | Super Administrator SPI | `admin@bsp.co.id` | SPI | Konfigurasi sistem, manajemen pengguna, inspeksi seluruh Log Jejak Audit. |
| **`manager_spi`** | Bambang Irawan (Kepala SPI) | `manager.spi@bsp.co.id` | SPI | Penerbitan disposisi, persetujuan dokumen SOP, inisiasi rapat audit strategis, pemantauan KPI. |
| **`auditor`** | Rendra Pratama (Lead Auditor) | `auditor.spi@bsp.co.id` | SPI | Pelaksana audit, penyusunan KKA/LHA, pengisian E-Notulen, penyelesaian disposisi. |
| **`auditor`** | Dwi Lestari (Auditor Keuangan) | `auditor.keuangan@bsp.co.id` | SPI | Auditor spesialisasi biaya, keuangan, dan kepatuhan pengadaan barang/jasa. |
| **`auditee`** | Ahmad Fauzi (PIC QHSE) | `auditee.qhse@bsp.co.id` | QHSE | Unit teraudit bidang Keselamatan, Kesehatan Kerja & Lindung Lingkungan. |
| **`auditee`** | Hendra Kusuma (PIC Lapangan) | `auditee.ops@bsp.co.id` | OPS | Unit teraudit operasi lapangan migas WK CPP (Zamrud / Minas). |
| **`auditee`** | Siti Nurhaliza (PIC Finance) | `auditee.fin@bsp.co.id` | FIN&ICT | Unit teraudit keuangan, anggaran, dan teknologi informasi. |

### 2.2 Matriks Hak Akses Modul

| Modul / Fitur | Super Admin | Manager SPI | Auditor | Auditee |
| :--- | :---: | :---: | :---: | :---: |
| **Dashboard Pengawasan** | Penuh | Penuh | Penuh | Terbatas (data unit sendiri) |
| **Dokumen Master SOP (Lihat)** | Ya | Ya | Ya | Terbatas (status TERKENDALI saja) |
| **Dokumen Master SOP (Tambah/Edit/Arsip)** | Ya | Ya | Ya | Tidak |
| **Unduh Dokumen Rahasia** | Ya | Ya | Ya | Khusus undangan/kewenangan |
| **Persuratan Internal & Eksternal** | Penuh | Penuh | Penuh | Hanya surat unitnya |
| **Penerbitan Disposisi Baru** | Ya | Ya | Tidak | Tidak |
| **Penyelesaian Disposisi (Laporan)** | Ya | Ya | Ya (Penerima) | Tidak |
| **Penjadwalan Rapat & E-Notulen** | Ya | Ya | Ya | Hanya jika diundang |
| **Penyuntingan Hasil Risalah/Notulen** | Ya | Ya | Ya (Pembuat/SPI) | Hanya membaca |
| **Log Aktivitas (Audit Trail)** | **Ya (Eksklusif)**| Tidak | Tidak | Tidak |

---

## BAB III: PANDUAN OPERASIONAL MODUL SISTEM (STEP-BY-STEP)

### 3.1 Akses Masuk & Keamanan Akun (Login + Captcha)
1. Buka peramban di alamat portal: `http://127.0.0.1:8000` (atau domain internal PT BSP).
2. Anda akan otomatis diarahkan ke halaman **Masuk Sistem Integrasi SPI**.
3. Masukkan **Email Korporat** dan **Kata Sandi**.
4. Perhatikan kotak **Validasi Keamanan (Captcha)**:
   - Selesaikan tantangan hitungan matematika sederhana (contoh: *Berapakah 7 + 4?*).
   - Masukkan angka hasil hitungan ke kolom isian.
   - Jika tulisan kurang jelas, klik tombol ikon putar di sebelah kanan untuk memperbarui tantangan.
5. Klik tombol **"Masuk ke Portal SPI"**. Sistem memvalidasi akun, mencatat IP address ke tabel audit log, dan mengarahkan Anda ke Dashboard Utama.

### 3.2 Dashboard Pengawasan Eksekutif
Dashboard menyajikan informasi terpusat secara *real-time*:
- **Header Sambutan:** Menampilkan nama pengguna, peran, unit kerja, serta stempel keaktifan portal.
- **4 Kartu Metrik KPI:**
  1. *Dokumen Terkendali:* Jumlah SOP/Pedoman aktif yang sah digunakan.
  2. *Disposisi Tertunda:* Jumlah surat masuk yang belum diberikan instruksi arahan oleh pimpinan.
  3. *Follow-Up Eksternal:* Surat dari instansi luar (SKK Migas/BPKP/Mitra) yang masih berstatus pending/dalam proses.
  4. *Jadwal Rapat Terdekat:* Rapat audit (Entry/Exit Meeting) yang akan datang.
- **Daftar Rapat Terdekat:** Menampilkan jenis rapat, judul, waktu, lokasi, dan tombol cepat *"Notulen"*.
- **Surat Butuh Tindak Lanjut:** Memuat nomor surat, perihal, dan tanggal jatuh tempo (*due date*).
- **Jejak Audit Terkini:** Cuplikan riwayat aktivitas mutasi data terkini di sistem.

### 3.3 Modul Dokumen Kontrol (Master SOP, Pedoman, WI, & Form)
Modul ini bertindak sebagai lemari arsip digital resmi PT Bumi Siak Pusako:
1. **Navigasi:** Klik menu **"Dokumen Master SOP"** di sidebar.
2. **Pencarian & Penyaringan:** Gunakan Search Bar untuk mencari berdasarkan judul/nomor dokumen, atau filter berdasarkan Tipe Dokumen (*SOP, MAN, WI, FORM*) dan Kerahasiaan.
3. **Menerbitkan Dokumen Baru:**
   - Klik tombol **"Tambah Dokumen"**.
   - Pilih Departemen dan Tipe Dokumen.
   - Klik tombol **"Generate Nomor"** untuk membuat nomor baku otomatis (misal: `SPI-BSP/SOP/001`).
   - Masukkan Judul, Versi (contoh: `01`), Tanggal Efektif, dan Tanggal Kadaluarsa.
   - Pilih Sifat Kerahasiaan (*Biasa, Terbatas, Rahasia, Sangat Rahasia*).
   - Unggah berkas dokumen (PDF, DOCX, XLSX; Maks 10MB).
   - Klik **"Simpan Dokumen"**.
4. **Siklus Hidup Dokumen Otomatis (Automatic Version Control):**
   - Saat dokumen revisi baru (misal versi `02`) disimpan dengan nomor dokumen dasar yang sama, sistem secara cerdas akan mengarsipkan versi `01` menjadi `KADALUARSA` dan menetapkan versi `02` sebagai dokumen aktif berstatus `TERKENDALI`.
5. **Keamanan Unduhan File:**
   - File berstatus Rahasia disimpan pada *Private Storage Engine* (`Storage::disk('local')`) dan hanya dapat diunduh oleh personil yang memiliki hak otorisasi.

### 3.4 Modul Persuratan SPI (Internal & Eksternal)
1. **Surat Internal:** Klik menu **"Surat Internal"** untuk mengelola naskah dinas antar departemen di lingkungan PT BSP.
   - Fitur **"Generate Nomor Baku"** menyediakan format: `[No]/SPI/[Kode]/[BulanRomawi]/[Tahun]`.
   - Untuk Laporan Hasil Audit resmi, sistem otomatis menerapkan kode: `[No]/LHA-SPI/[BulanRomawi]/[Tahun]`.
2. **Surat Eksternal:** Klik menu **"Surat Eksternal"** untuk surat dari/ke pihak luar (SKK Migas, BPKP, Ditjen Migas, Kontraktor).
   - **Pemantauan Follow-Up:** Setiap surat eksternal memiliki atribut status tindak lanjut: `Belum Tindak Lanjut`, `Dalam Proses`, atau `Selesai`.
   - Klik tombol **"Update Follow-Up"** pada baris surat untuk mencatat progres klarifikasi dan tanggal batas waktu tindak lanjut.

### 3.5 Modul Lembar Disposisi Digital
Menghilangkan keterlambatan disposisi berbasis kertas (*paperless workflow*):
1. **Membuat Disposisi (Khusus Manager SPI / Pimpinan):**
   - Masuk ke menu **"Lembar Disposisi"**.
   - Klik **"Beri Disposisi"**.
   - Pilih Surat Masuk yang menjadi rujukan.
   - Pilih Penerima Disposisi (Auditor / Staf pelaksana).
   - Pilih Instruksi Tindakan: *Untuk Diketahui, Ditindaklanjuti, Dibalas, Dikoordinasikan, Dipelajari, atau Diarsipkan*.
   - Tetapkan Tingkat Urgensi: **Biasa**, **Segera**, atau **Kilat**.
   - Tentukan Batas Waktu Penyelesaian (*Due Date*) dan masukkan catatan arahan.
   - Klik **"Kirim Disposisi"**.
2. **Merespon & Menyelesaikan Disposisi (Auditor):**
   - Auditor yang menerima disposisi membuka modul Disposisi.
   - Klik tombol **"Tindak Lanjut / Selesaikan"**.
   - Isi laporan singkat hasil tindak lanjut pada kolom *Catatan Penyelesaian*.
   - Klik simpan; status berubah menjadi `Selesai` dan stempel waktu selesai terekam otomatis.

### 3.6 Modul Manajemen Rapat & E-Notulen Digital
Menjamin dokumentasi pertemuan audit tersimpan rapi dan mengikat secara formal:
1. **Menjadwalkan Rapat Audit:**
   - Buka menu **"Jadwal & E-Notulen"**, lalu klik **"Jadwalkan Rapat"**.
   - Pilih Jenis Rapat: *Entry Meeting, Exit Meeting, Rapat Internal SPI, atau Rapat Pimpinan*.
   - Masukkan Judul, Tanggal, Jam Mulai, Jam Selesai, dan Ruangan / Tautan Virtual.
   - Masukkan daftar email peserta undangan (*Invitees*).
   - Simpan jadwal.
2. **Mengisi & Mengesahkan E-Notulen:**
   - Pada baris rapat, klik tombol **"Buka Notulen"** atau klik judul rapat.
   - Buka tab **"Penyusunan Risalah / E-Notulen"**.
   - Catat seluruh pokok bahasan pada kolom **Poin Pembahasan / Diskusi**.
   - Catat butir kesepakatan pada kolom **Hasil Keputusan Rapat**.
   - Unggah berkas pendukung (daftar hadir bertandatangan atau materi presentasi).
   - Ubah status rapat menjadi `Selesai`, lalu klik **"Simpan Notulen"**.
3. **Penguncian Akses:**
   - Pengguna dengan peran *Auditee* hanya dapat membaca E-Notulen jika alamat emailnya tercantum dalam daftar undangan rapat tersebut.

### 3.7 Modul Log Jejak Audit (Audit Trail)
*(Hanya dapat diakses oleh akun `super_admin`)*
1. Masuk menggunakan akun Super Administrator.
2. Klik menu **"Log Aktivitas (Audit)"** di bagian bawah sidebar.
3. Seluruh riwayat mutasi data ditampilkan dalam format tabel kronologis:
   - **Waktu:** Tanggal dan jam aksi dilakukan.
   - **Pengguna:** Nama dan peran pengguna yang mengeksekusi aksi.
   - **Aksi:** Kode aksi (*CREATE, UPDATE, DELETE, LOGIN, LOGOUT*).
   - **Deskripsi:** Detail catatan operasional (misal: judul dokumen yang diterbitkan atau disposisi yang dikirim).
   - **IP Address:** Alamat IP perangkat asal eksekusi.
4. Gunakan fitur pencarian bebas dan penyaringan tipe aksi untuk audit kepatuhan IT.

---

## BAB IV: STANDAR OPERASIONAL PROSEDUR (SOP) PENGGUNAAN SISTEM

### SOP 01: Penanganan Surat Masuk & Disposisi
1. Petugas Administrasi / Auditor menginput surat masuk yang diterima ke modul **Persuratan** dalam waktu maksimal 1x24 jam sejak surat fisik/email diterima.
2. Kepala SPI memeriksa modul **Lembar Disposisi** secara berkala (minimal 2 kali sehari: pukul 09.00 WIB dan 14.00 WIB).
3. Kepala SPI menerbitkan lembar disposisi digital dengan menetapkan Auditor PIC, instruksi, urgensi, dan tanggal jatuh tempo.
4. Auditor penerima disposisi wajib menindaklanjuti arahan sebelum tanggal jatuh tempo dan mengunggah laporan hasil tindak lanjut ke sistem.

### SOP 02: Pengendalian Dokumen SOP & Pedoman Mutu
1. Draf SOP baru atau revisi disusun oleh Tim SPI dan diverifikasi format penomorannya melalui tombol *Generate Nomor Baku*.
2. Dokumen yang disahkan diunggah ke sistem dengan status `TERKENDALI`.
3. Dokumen lama secara otomatis berubah status menjadi `KADALUARSA` dan diarsipkan secara digital dengan masa retensi minimal 3 (tiga) tahun.
4. Seluruh personil PT BSP dilarang menggunakan atau mendistribusikan salinan dokumen bertanda `KADALUARSA`.

### SOP 03: Penyelenggaraan Rapat Audit & E-Notulen
1. Jadwal *Entry Meeting* dan *Exit Meeting* wajib diinput ke sistem paling lambat 2 (dua) hari kerja sebelum rapat dilaksanakan dengan mencantumkan daftar undangan lengkap.
2. Notulis rapat / Auditor mencatat jalannya pertemuan secara langsung pada formulir E-Notulen.
3. Seluruh butir keputusan rapat wajib difinalisasi dan disimpan ke sistem maksimal 1x24 jam setelah rapat berakhir.

---

## BAB V: SKENARIO DEMO PRESENTASI MANAJEMEN (10-MINUTE GOLDEN PATH)

Gunakan alur panduan 10 menit di bawah ini saat mempresentasikan sistem di hadapan Dewan Direksi dan Manajemen SPI:

| Menit Ke- | Aksi & Akun yang Digunakan | Narasi & Pesan Kunci yang Disampaikan |
| :---: | :--- | :--- |
| **00 - 02** | **Login Super Admin**<br>`admin@bsp.co.id` | Tunjukkan keamanan form login dengan verifikasi tantangan matematika (Captcha) dan jelaskan tampilan Dashboard Eksekutif terpadu dengan 4 metrik KPI. |
| **02 - 04** | **Dokumen Master SOP** | Tunjukkan dokumen `SPI-BSP/SOP/001`. Jelaskan fitur auto-numbering baku dan kontrol versi otomatis (saat versi 02 terbit, versi 01 otomatis jadi Kadaluarsa). Uji coba unduhan private storage. |
| **04 - 06** | **Persuratan & Disposisi**<br>Ganti ke: `manager.spi@bsp.co.id` | Tunjukkan surat masuk klarifikasi lifting dari SKK Migas. Buat disposisi kilat langsung ke Lead Auditor (Rendra Pratama) dengan instruksi rekonsiliasi. |
| **06 - 08** | **Tindak Lanjut Auditor**<br>Ganti ke: `auditor.spi@bsp.co.id` | Tunjukkan disposisi kilat yang baru masuk di layar auditor. Buka form dan tandai disposisi menjadi *Selesai* lengkap dengan catatan laporan hasil rekonsiliasi. |
| **08 - 09** | **Rapat & E-Notulen** | Buka menu Jadwal Rapat, perlihatkan *Exit Meeting Hasil Audit Pengadaan Rig Lapangan*, buka tab E-Notulen yang berisi poin diskusi dan keputusan final. |
| **09 - 10** | **Audit Trail & Penutup**<br>Ganti ke: `admin@bsp.co.id` | Buka menu Log Aktivitas. Tunjukkan bahwa seluruh rangkaian aksi demo yang baru saja dilakukan terekam secara detik demi detik beserta IP address dan nama user. |

---

## BAB VI: TANYA JAWAB TEKNIS (FAQ) & TROUBLESHOOTING

**Q1: Bagaimana jika saya lupa jawaban Captcha atau angka terlihat rumit?**  
*Jawab:* Klik ikon putar (*refresh*) di samping kotak tantangan captcha. Sistem akan memuat soal hitungan baru yang lebih mudah tanpa perlu memuat ulang seluruh halaman web.

**Q2: Mengapa file bertanda "Sangat Rahasia" tidak bisa diunduh oleh staf unit lain?**  
*Jawab:* Sistem menerapkan proteksi ketat berbasis peran (*RBAC*). Dokumen Sangat Rahasia hanya dapat diunduh oleh Direksi, Kepala SPI, dan Auditor berwenang.

**Q3: Apakah data yang terhapus masih bisa dipulihkan?**  
*Jawab:* Ya. Seluruh tabel data utama menerapkan protokol *Soft Deletes*. Data yang dihapus tidak dimusnahkan secara permanen dari basis data fisik, melainkan ditandai arsip sehingga jejak kepatuhan audit tetap utuh.

**Q4: Ke mana saya harus melapor jika menemukan kendala teknis?**  
*Jawab:* Hubungi Tim Administrator IT SPI PT Bumi Siak Pusako melalui email resmi: `admin@bsp.co.id` atau Ruang Dukungan Sistem Kantor Pusat PT BSP.
