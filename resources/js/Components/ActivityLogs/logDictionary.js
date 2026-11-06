export const FIELD_LABELS = {
    // Surat (Letters)
    scope: 'Ruang Lingkup Surat',
    sender: 'Asal Surat (Pengirim)',
    subject: 'Perihal Surat',
    direction: 'Arah Alur Surat',
    recipient: 'Tujuan Surat (Penerima)',
    letter_date: 'Tanggal Surat',
    letter_number: 'Nomor Surat Resmi',
    agenda_number: 'Nomor Agenda Surat',
    letter_type_code: 'Kode / Jenis Surat',
    confidentiality: 'Klasifikasi Kerahasiaan',
    followup_status: 'Status Tindak Lanjut',
    followup_due_date: 'Batas Waktu Tindak Lanjut',
    followup_notes: 'Catatan Tindak Lanjut',
    recipient_department_id: 'Departemen Tujuan',
    received_date: 'Tanggal Diterima',
    approval_status: 'Status Persetujuan',
    file_path: 'Berkas Lampiran',

    // Rapat (Meetings)
    title: 'Agenda / Judul Rapat',
    meeting_type: 'Jenis Rapat',
    meeting_mode: 'Mode Pelaksanaan Rapat',
    platform: 'Platform Rapat Online',
    room_id: 'Ruang Rapat',
    meeting_room_id: 'Ruang Rapat',
    meeting_date_start: 'Tanggal Mulai Rapat',
    meeting_date_end: 'Tanggal Selesai Rapat',
    start_time: 'Waktu Mulai',
    end_time: 'Waktu Selesai',
    invitees: 'Daftar Peserta / Undangan',
    location: 'Lokasi Rapat',
    meeting_link: 'Tautan Rapat Online',
    minutes_of_meeting: 'Ringkasan Notulen Rapat',

    // Dokumen Master SOP
    document_number: 'Nomor Dokumen',
    category: 'Kategori Dokumen',
    version: 'Versi Dokumen',
    effective_date: 'Tanggal Berlaku',

    // Pengguna (Users) & Pegawai (Employees)
    name: 'Nama Lengkap',
    email: 'Alamat Email',
    role: 'Peran Pengguna (Role)',
    department_id: 'Departemen / Unit Kerja',
    position: 'Jabatan',
    phone: 'Nomor Telepon',
    is_pjs: 'Status PJS Manager',
    pjs_start_date: 'Tanggal Mulai PJS',
    pjs_end_date: 'Tanggal Berakhir PJS',

    // Disposisi
    instruction: 'Instruksi Arahan Disposisi',
    urgency: 'Tingkat Urgensi',
    notes: 'Catatan Arahan',
    due_date: 'Batas Waktu Penyelesaian',
    status: 'Status Penyelesaian',
    completion_notes: 'Laporan Hasil Tindak Lanjut',
    completed_at: 'Waktu Penyelesaian',

    // KPI
    target_value: 'Nilai Target',
    realization_value: 'Nilai Realisasi',
    actual_value: 'Nilai Realisasi',
    unit: 'Satuan Ukuran',
    polarity: 'Polarisasi Target',
    kpi_period_id: 'Periode Tahun KPI',
    category_id: 'Kategori KPI',

    // Data Master
    code: 'Kode Referensi',
    capacity: 'Kapasitas Ruangan',
    is_active: 'Status Keaktifan',
    description: 'Deskripsi Keterangan',
};

export const VALUE_LABELS = {
    // Ruang Lingkup & Arah
    internal: 'Surat Internal',
    external: 'Surat Eksternal',
    incoming: 'Surat Masuk',
    outgoing: 'Surat Keluar',

    // Status Tindak Lanjut
    not_required: 'Tidak Diperlukan',
    pending: 'Menunggu Tindak Lanjut',
    in_progress: 'Sedang Diproses',
    completed: 'Selesai Dikerjakan',

    // Status Approval
    pending_approval: 'Menunggu Persetujuan',
    approved: 'Disetujui',
    rejected: 'Ditolak',

    // Mode Rapat
    Offline: 'Tatap Muka (Offline)',
    offline: 'Tatap Muka (Offline)',
    Online: 'Daring (Online)',
    online: 'Daring (Online)',
    scheduled: 'Terjadwal',
    ongoing: 'Sedang Berlangsung',
    cancelled: 'Dibatalkan',

    // Role
    super_admin: 'Super Admin',
    manager_spi: 'Manager SPI',
    auditor: 'Auditor SPI',
    auditee: 'Auditee (PIC Departemen)',

    // Polarisasi KPI
    maximize: 'Maksimal (Semakin tinggi semakin baik)',
    minimize: 'Minimal (Semakin rendah semakin baik)',

    // Jenis Surat
    ST: 'Surat Tugas (ST)',
    PA: 'Pemberitahuan Audit (PA)',
    DT: 'Permintaan Data (DT)',
    KF: 'Konfirmasi (KF)',
    TL: 'Tindak Lanjut (TL)',
    KS: 'Konsultasi (KS)',
    KP: 'Korespondensi Eksternal (KP)',
    UM: 'Umum (UM)',
    LHA: 'Laporan Hasil Audit (LHA)',
    LAP: 'Laporan (LAP)',
};

export function getFriendlyFieldLabel(key) {
    if (FIELD_LABELS[key]) return FIELD_LABELS[key];
    // Fallback: convert snake_case to Title Case
    return key
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function formatFriendlyValue(val, key = '') {
    if (val === null || val === undefined || val === '') {
        return null; // Handle null/empty separately in renderer
    }

    if (typeof val === 'boolean') {
        return val ? 'Aktif (Ya)' : 'Nonaktif (Tidak)';
    }

    if (Array.isArray(val)) {
        if (val.length === 0) return 'Kosong (0 item)';
        return val.join(', ');
    }

    if (typeof val === 'object') {
        return JSON.stringify(val, null, 2);
    }

    const strVal = String(val).trim();

    // Check mapped enum values
    if (VALUE_LABELS[strVal]) {
        return VALUE_LABELS[strVal];
    }

    // Check if ISO date string (e.g. 2026-11-06T00:00:00.000000Z or 2026-11-06)
    if (/^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d+)?Z?)?$/.test(strVal)) {
        try {
            const date = new Date(strVal);
            if (!isNaN(date.getTime())) {
                const isDateOnly = !strVal.includes('T') || strVal.includes('T00:00:00');
                if (isDateOnly) {
                    return date.toLocaleDateString('id-ID', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                    });
                }
                return date.toLocaleString('id-ID', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                }) + ' WIB';
            }
        } catch (e) {
            // fallback to original string
        }
    }

    return strVal;
}

