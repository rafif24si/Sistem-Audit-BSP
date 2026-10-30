<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Undangan Rapat - SPI PT Bumi Siak Pusako</title>
    <style>
        body {
            font-family: 'Segoe UI', Helvetica, Arial, sans-serif;
            background-color: #f1f5f9;
            margin: 0;
            padding: 24px 12px;
            color: #1e293b;
        }
        .container {
            max-width: 640px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
            border: 1px solid #e2e8f0;
        }
        .header {
            background-color: #194f2b;
            padding: 24px 32px;
            text-align: center;
            border-bottom: 4px solid #22c55e;
        }
        .header img {
            max-height: 54px;
            width: auto;
            background: #ffffff;
            padding: 6px 14px;
            border-radius: 8px;
            display: inline-block;
            margin-bottom: 12px;
        }
        .header h1 {
            color: #ffffff;
            font-size: 18px;
            margin: 0;
            font-weight: 700;
            letter-spacing: 0.5px;
        }
        .header p {
            color: #d1fae5;
            font-size: 12px;
            margin: 4px 0 0 0;
        }
        .content {
            padding: 32px;
        }
        .badge-title {
            display: inline-block;
            background-color: #ecfdf5;
            color: #065f46;
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            padding: 4px 12px;
            border-radius: 9999px;
            border: 1px solid #a7f3d0;
            margin-bottom: 16px;
        }
        .agenda-box {
            background-color: #f8fafc;
            border: 1px solid #e2e8f0;
            border-left: 4px solid #194f2b;
            border-radius: 6px;
            padding: 16px;
            margin-bottom: 24px;
        }
        .agenda-title {
            font-size: 16px;
            font-weight: 700;
            color: #0f172a;
            margin: 0 0 4px 0;
        }
        .agenda-type {
            font-size: 12px;
            color: #64748b;
            font-weight: 500;
        }
        .details-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 24px;
            font-size: 13px;
        }
        .details-table th, .details-table td {
            padding: 10px 12px;
            border-bottom: 1px solid #f1f5f9;
            text-align: left;
        }
        .details-table th {
            width: 32%;
            color: #64748b;
            font-weight: 600;
            background-color: #f8fafc;
        }
        .details-table td {
            color: #1e293b;
            font-weight: 500;
        }
        .btn-link {
            display: inline-block;
            background-color: #194f2b;
            color: #ffffff !important;
            text-decoration: none;
            padding: 10px 20px;
            border-radius: 6px;
            font-size: 13px;
            font-weight: 600;
            margin-top: 8px;
        }
        .footer {
            background-color: #f8fafc;
            padding: 24px 32px;
            text-align: center;
            border-top: 1px solid #e2e8f0;
            font-size: 11px;
            color: #64748b;
            line-height: 1.6;
        }
        .footer strong {
            color: #334155;
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            @if(file_exists(public_path('images/logo.png')))
                <img src="{{ $message->embed(public_path('images/logo.png')) }}" alt="Logo PT Bumi Siak Pusako" />
            @endif
            <h1>PT BUMI SIAK PUSAKO</h1>
            <p>Satuan Pengawasan Intern (SPI) &bull; Sistem Integrasi Pengawasan</p>
        </div>

        <!-- Main Content -->
        <div class="content">
            <span class="badge-title">Undangan Rapat Resmi</span>
            
            <p style="font-size: 14px; margin-top: 0;">
                Kepada Yth. <strong>Bapak/Ibu Peserta Rapat</strong>,<br>
                Di Tempat
            </p>

            <p style="font-size: 13px; line-height: 1.6; color: #334155;">
                Dengan hormat, bersama ini Satuan Pengawasan Intern (SPI) PT Bumi Siak Pusako mengundang Bapak/Ibu untuk menghadiri agenda rapat audit internal dengan rincian sebagai berikut:
            </p>

            <!-- Agenda Box -->
            <div class="agenda-box">
                <div class="agenda-title">{{ $meeting->title }}</div>
                <div class="agenda-type">Jenis Agenda: <strong>{{ $meeting->meeting_type }}</strong> &bull; Sifat: <strong>{{ $meeting->confidentiality }}</strong></div>
            </div>

            <!-- Table Schedule Details -->
            <table class="details-table">
                <tr>
                    <th>Hari, Tanggal</th>
                    <td>
                        {{ \Carbon\Carbon::parse($meeting->meeting_date)->locale('id')->isoFormat('dddd, D MMMM Y') }}
                    </td>
                </tr>
                <tr>
                    <th>Waktu Pelaksanaan</th>
                    <td>
                        {{ substr($meeting->start_time, 0, 5) }} WIB
                        @if($meeting->end_time)
                            s.d. {{ substr($meeting->end_time, 0, 5) }} WIB
                        @else
                            s.d. Selesai
                        @endif
                    </td>
                </tr>
                <tr>
                    <th>Mode Pelaksanaan</th>
                    <td>
                        <strong>{{ $meeting->meeting_mode }}</strong>
                        @if($meeting->meeting_mode === 'Online')
                            ({{ $meeting->platform }})
                        @else
                            (Tatap Muka)
                        @endif
                    </td>
                </tr>
                <tr>
                    <th>
                        {{ $meeting->meeting_mode === 'Online' ? 'Tautan / Link Rapat' : 'Lokasi / Ruangan' }}
                    </th>
                    <td>
                        @if($meeting->meeting_mode === 'Online' && (str_starts_with($meeting->location, 'http://') || str_starts_with($meeting->location, 'https://')))
                            <div style="margin-bottom: 6px;">
                                <a href="{{ $meeting->location }}" target="_blank" class="btn-link">
                                    Gabung ke {{ $meeting->platform }} &rarr;
                                </a>
                            </div>
                            <span style="font-size: 11px; color: #64748b; word-break: break-all;">
                                Tautan langsung: <a href="{{ $meeting->location }}" target="_blank" style="color: #194f2b;">{{ $meeting->location }}</a>
                            </span>
                        @else
                            <strong>{{ $meeting->location }}</strong>
                        @endif
                    </td>
                </tr>
                @if($meeting->discussion_points)
                <tr>
                    <th>Pokok Bahasan</th>
                    <td>{{ $meeting->discussion_points }}</td>
                </tr>
                @endif
            </table>

            <p style="font-size: 13px; line-height: 1.6; color: #334155;">
                Mengingat pentingnya materi dan hasil keputusan yang akan disepakati, kami mengharapkan kehadiran Bapak/Ibu tepat pada waktu yang telah ditentukan.
            </p>

            <div style="margin-top: 28px; font-size: 13px; color: #334155;">
                Hormat kami,<br>
                <strong>Satuan Pengawasan Intern (SPI)</strong><br>
                <span>PT Bumi Siak Pusako</span>
            </div>
        </div>

        <!-- Footer -->
        <div class="footer">
            <strong>PT BUMI SIAK PUSAKO</strong> &bull; Badan Usaha Milik Daerah (BUMD)<br>
            Pengelola Wilayah Kerja Coastal Plain Pekanbaru (WK CPP)<br>
            Gedung Surya Dumai Lt. 4, 6 & 8, Jl. Jend. Sudirman No. 395, Pekanbaru, Riau 28116<br>
            Telp: (62-761) 855-764 &bull; Email: helpdesk@bsp.co.id &bull; Website: ptbsp.id<br>
            <span style="font-size: 10px; color: #94a3b8; display: block; margin-top: 8px;">
                Email ini dibuat dan dikirim secara otomatis oleh Sistem Integrasi SPI PT BSP. Mohon tidak membalas langsung ke alamat ini.
            </span>
        </div>
    </div>
</body>
</html>

