<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Risalah Notulen Rapat - {{ $meeting->title }}</title>
    <style>
        @page {
            margin: 1.5cm 2cm;
            size: A4 portrait;
        }

        body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            font-size: 11pt;
            line-height: 1.4;
            color: #1e293b;
        }

        /* Kop Surat Table Layout */
        .kop-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 2px;
        }

        .kop-logo {
            width: 85px;
            text-align: center;
            vertical-align: middle;
            padding-right: 15px;
        }

        .kop-logo img {
            width: 75px;
            height: auto;
        }

        .kop-text {
            text-align: center;
            vertical-align: middle;
        }

        .kop-company {
            font-size: 15pt;
            font-weight: bold;
            color: #0f172a;
            letter-spacing: 1px;
            margin-bottom: 2px;
        }

        .kop-sub {
            font-size: 8.5pt;
            font-weight: 600;
            color: #334155;
            line-height: 1.3;
        }

        .kop-unit {
            font-size: 10.5pt;
            font-weight: bold;
            color: #047857; /* Emerald/Green tone of BSP */
            margin-top: 3px;
            margin-bottom: 3px;
            letter-spacing: 0.5px;
        }

        .kop-address {
            font-size: 7.5pt;
            color: #64748b;
            line-height: 1.35;
        }

        .kop-divider-double {
            border: none;
            border-top: 2.5px solid #0f172a;
            border-bottom: 1px solid #0f172a;
            height: 3px;
            margin-top: 6px;
            margin-bottom: 18px;
        }

        /* Document Title */
        .doc-title-container {
            text-align: center;
            margin-bottom: 16px;
        }

        .doc-title {
            font-size: 13pt;
            font-weight: bold;
            text-decoration: underline;
            text-transform: uppercase;
            letter-spacing: 0.8px;
            color: #0f172a;
            margin-bottom: 4px;
        }

        .doc-subtitle {
            font-size: 9.5pt;
            color: #475569;
        }

        /* Info Table */
        .info-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 16px;
            font-size: 9.5pt;
            background-color: #f8fafc;
            border: 1px solid #cbd5e1;
        }

        .info-table td {
            padding: 6px 10px;
            vertical-align: top;
            border-bottom: 1px solid #e2e8f0;
        }

        .info-label {
            width: 22%;
            font-weight: bold;
            color: #334155;
        }

        .info-colon {
            width: 2%;
            text-align: center;
            font-weight: bold;
        }

        .info-value {
            width: 76%;
            color: #0f172a;
        }

        /* Badge Pills */
        .badge {
            display: inline-block;
            padding: 2px 7px;
            font-size: 8pt;
            font-weight: bold;
            border-radius: 4px;
            text-transform: uppercase;
        }

        .badge-offline { background-color: #e2e8f0; color: #334155; }
        .badge-online { background-color: #dbeafe; color: #1e40af; }
        .badge-biasa { background-color: #f1f5f9; color: #475569; }
        .badge-terbatas { background-color: #fef3c7; color: #92400e; }
        .badge-rahasia { background-color: #fee2e2; color: #991b1b; }

        /* Section Boxes */
        .section-header {
            font-size: 10.5pt;
            font-weight: bold;
            color: #0f172a;
            margin-top: 14px;
            margin-bottom: 6px;
            border-bottom: 1.5px solid #047857;
            padding-bottom: 3px;
        }

        .section-box {
            border: 1px solid #cbd5e1;
            background-color: #ffffff;
            border-radius: 4px;
            padding: 10px 12px;
            margin-bottom: 12px;
            font-size: 9.5pt;
            line-height: 1.5;
            color: #1e293b;
            min-height: 50px;
        }

        /* Participant List */
        .participant-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 9pt;
            margin-bottom: 14px;
        }

        .participant-table th, .participant-table td {
            border: 1px solid #cbd5e1;
            padding: 5px 8px;
            text-align: left;
        }

        .participant-table th {
            background-color: #f1f5f9;
            color: #334155;
            font-weight: bold;
        }

        /* Signatures Block */
        .signatures-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 25px;
            page-break-inside: avoid;
        }

        .signatures-table td {
            width: 50%;
            vertical-align: top;
            text-align: center;
            padding: 0 10px;
            font-size: 9.5pt;
        }

        .sign-title {
            font-weight: bold;
            margin-bottom: 65px;
            color: #334155;
        }

        .sign-name {
            font-weight: bold;
            text-decoration: underline;
            color: #0f172a;
        }

        .sign-role {
            font-size: 8.5pt;
            color: #64748b;
        }

        .footer-note {
            margin-top: 25px;
            font-size: 7.5pt;
            color: #94a3b8;
            border-top: 1px dashed #cbd5e1;
            padding-top: 6px;
            text-align: center;
        }
    </style>
</head>
<body>

    <!-- KOP SURAT RESMI PT BUMI SIAK PUSAKO -->
    <table class="kop-table">
        <tr>
            <td class="kop-logo">
                @if(isset($logoBase64) && $logoBase64)
                    <img src="data:image/png;base64,{{ $logoBase64 }}" alt="Logo BSP">
                @elseif(file_exists(public_path('images/logo.png')))
                    <img src="{{ public_path('images/logo.png') }}" alt="Logo BSP">
                @endif
            </td>
            <td class="kop-text">
                <div class="kop-company">PT BUMI SIAK PUSAKO</div>
                <div class="kop-sub">
                    Badan Usaha Milik Daerah (BUMD) – Pengelola Wilayah Kerja Coastal Plain Pekanbaru (WK CPP)
                </div>
                <div class="kop-unit">SATUAN PENGAWASAN INTERN (SPI)</div>
                <div class="kop-address">
                    Kantor Pusat: Gedung Surya Dumai Lt. 4, 6 & 8, Jl. Jend. Sudirman No. 395, Pekanbaru, Riau 28116<br>
                    Kantor Jakarta: JB Tower Lt. 15, Jl. Kebon Sirih No. 48–50, Jakarta Pusat | Camp Operasional: Camp Zamrud, Kab. Siak, Riau<br>
                    Telp & Faks: (62-761) 855-764 | Email: helpdesk@bsp.co.id | Website: https://ptbsp.id
                </div>
            </td>
        </tr>
    </table>
    
    <div class="kop-divider-double"></div>

    <!-- JUDUL DOKUMEN -->
    <div class="doc-title-container">
        <div class="doc-title">RISALAH / NOTULEN RAPAT</div>
        <div class="doc-subtitle">Nomor Arsip Rapat: BSP/SPI-NOT/{{ \Carbon\Carbon::parse($meeting->meeting_date)->format('Ym') }}/{{ str_pad($meeting->id, 4, '0', STR_PAD_LEFT) }}</div>
    </div>

    <!-- METADATA RAPAT -->
    <table class="info-table">
        <tr>
            <td class="info-label">Agenda / Perihal</td>
            <td class="info-colon">:</td>
            <td class="info-value"><strong>{{ $meeting->title }}</strong></td>
        </tr>
        <tr>
            <td class="info-label">Jenis Pertemuan Audit</td>
            <td class="info-colon">:</td>
            <td class="info-value">{{ $meeting->meeting_type }}</td>
        </tr>
        <tr>
            <td class="info-label">Hari / Tanggal</td>
            <td class="info-colon">:</td>
            <td class="info-value">
                {{ \Carbon\Carbon::parse($meeting->meeting_date)->locale('id')->isoFormat('dddd, D MMMM Y') }}
            </td>
        </tr>
        <tr>
            <td class="info-label">Waktu Pelaksanaan</td>
            <td class="info-colon">:</td>
            <td class="info-value">
                {{ substr($meeting->start_time, 0, 5) }} {{ $meeting->end_time ? 's/d ' . substr($meeting->end_time, 0, 5) : '' }} WIB
            </td>
        </tr>
        <tr>
            <td class="info-label">Mode & Tempat / Platform</td>
            <td class="info-colon">:</td>
            <td class="info-value">
                <span class="badge {{ $meeting->meeting_mode === 'Online' ? 'badge-online' : 'badge-offline' }}">
                    {{ $meeting->meeting_mode ?? 'Offline' }}
                </span>
                &nbsp;—&nbsp;
                <strong>Platform:</strong> {{ $meeting->platform ?? ($meeting->meeting_mode === 'Online' ? 'Zoom' : 'Tatap Muka') }}
                &nbsp;|&nbsp;
                <strong>Lokasi/Tautan:</strong> {{ $meeting->location }}
            </td>
        </tr>
        <tr>
            <td class="info-label">Sifat & Status Rapat</td>
            <td class="info-colon">:</td>
            <td class="info-value">
                <span class="badge {{ strtolower($meeting->confidentiality) === 'rahasia' ? 'badge-rahasia' : (strtolower($meeting->confidentiality) === 'terbatas' ? 'badge-terbatas' : 'badge-biasa') }}">
                    {{ $meeting->confidentiality }}
                </span>
                &nbsp;|&nbsp;
                <strong>Status:</strong> {{ $meeting->status }}
            </td>
        </tr>
        <tr>
            <td class="info-label">Penyelenggara / Pembuat</td>
            <td class="info-colon">:</td>
            <td class="info-value">
                {{ $meeting->creator?->name ?? 'Staf Satuan Pengawasan Intern' }} 
                ({{ $meeting->creator?->department?->name ?? 'Satuan Pengawasan Intern (SPI)' }})
            </td>
        </tr>
    </table>

    <!-- DAFTAR PESERTA / UNDANGAN -->
    <div class="section-header">I. DAFTAR PESERTA UNDANGAN RAPAT</div>
    @php
        $inviteeList = is_array($meeting->invitees) ? $meeting->invitees : [];
    @endphp
    @if(count($inviteeList) > 0)
        <table class="participant-table">
            <thead>
                <tr>
                    <th style="width: 8%; text-align: center;">No.</th>
                    <th style="width: 52%;">Nama Peserta / Pejabat / Tim</th>
                    <th style="width: 40%; text-align: center;">Keterangan Status</th>
                </tr>
            </thead>
            <tbody>
                @foreach($inviteeList as $index => $invitee)
                    <tr>
                        <td style="text-align: center;">{{ $index + 1 }}</td>
                        <td><strong>{{ $invitee }}</strong></td>
                        <td style="text-align: center; color: #047857;">Terundang & Hadir</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    @else
        <div class="section-box" style="font-style: italic; color: #64748b;">
            Tidak ada daftar peserta khusus yang dicantumkan.
        </div>
    @endif

    <!-- POIN-POIN PEMBAHASAN RAPAT -->
    <div class="section-header">II. POIN-POIN PEMBAHASAN RAPAT (E-NOTULEN)</div>
    <div class="section-box">
        @if(!empty(trim($meeting->discussion_points ?? '')))
            {!! nl2br(e($meeting->discussion_points)) !!}
        @else
            <span style="font-style: italic; color: #94a3b8;">Belum ada catatan poin pembahasan yang dicatat untuk agenda ini.</span>
        @endif
    </div>

    <!-- HASIL KEPUTUSAN & TINDAK LANJUT -->
    <div class="section-header">III. HASIL KEPUTUSAN & TINDAK LANJUT RAPAT</div>
    <div class="section-box">
        @if(!empty(trim($meeting->decisions ?? '')))
            {!! nl2br(e($meeting->decisions)) !!}
        @else
            <span style="font-style: italic; color: #94a3b8;">Belum ada butir keputusan atau tindak lanjut yang dicatat.</span>
        @endif
    </div>

    <!-- BLOK PENGESAHAN / TANDA TANGAN -->
    <table class="signatures-table">
        <tr>
            <td>
                <div class="sign-title">
                    Notulis / Penyusun Risalah,<br>
                    Satuan Pengawasan Intern
                </div>
                <div class="sign-name">{{ $meeting->creator?->name ?? 'Auditor / Notulis SPI' }}</div>
                <div class="sign-role">NIP/ID: {{ $meeting->creator?->id ? 'BSP-SPI-' . str_pad($meeting->creator->id, 3, '0', STR_PAD_LEFT) : '-' }}</div>
            </td>
            <td>
                <div class="sign-title">
                    Pimpinan Rapat / Disetujui Oleh,<br>
                    Kepala SPI PT Bumi Siak Pusako
                </div>
                <div class="sign-name">MANAGER SPI</div>
                <div class="sign-role">Satuan Pengawasan Intern PT BSP</div>
            </td>
        </tr>
    </table>

    <div class="footer-note">
        Dokumen ini diterbitkan secara otomatis dan sah melalui Sistem Integrasi Arsip & Audit Satuan Pengawasan Intern (SPI) PT Bumi Siak Pusako.<br>
        Dicetak pada: {{ \Carbon\Carbon::now()->locale('id')->isoFormat('D MMMM Y, HH:mm:ss') }} WIB | Keamanan Dokumen Terjamin
    </div>

</body>
</html>
