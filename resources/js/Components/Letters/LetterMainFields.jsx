import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { Sparkles } from 'lucide-react';

export default function LetterMainFields({
    data,
    setData,
    errors,
    departments = [],
    isEdit,
    onAutoGenerateNumber,
}) {
    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <InputLabel htmlFor="direction" value="Arah Alur Surat" />
                    <select
                        id="direction"
                        value={data.direction}
                        onChange={(e) => setData('direction', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-600 focus:ring-emerald-600 sm:text-sm"
                    >
                        <option value="incoming">Surat Masuk</option>
                        <option value="outgoing">Surat Keluar</option>
                    </select>
                </div>
                <div>
                    <InputLabel htmlFor="letter_type_code" value="Kode Jenis Surat" />
                    <select
                        id="letter_type_code"
                        value={data.letter_type_code}
                        onChange={(e) => setData('letter_type_code', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-600 focus:ring-emerald-600 sm:text-sm"
                    >
                        <option value="ST">ST - Surat Tugas</option>
                        <option value="PA">PA - Pemberitahuan Audit / Undangan</option>
                        <option value="DT">DT - Permintaan Data</option>
                        <option value="KF">KF - Konfirmasi</option>
                        <option value="TL">TL - Tindak Lanjut</option>
                        <option value="KS">KS - Konsultasi</option>
                        <option value="KP">KP - Korespondensi Eksternal</option>
                        <option value="UM">UM - Umum</option>
                        <option value="LHA">LHA - Laporan Hasil Audit</option>
                    </select>
                </div>
            </div>

            <div>
                <div className="flex items-center justify-between">
                    <InputLabel htmlFor="letter_number" value="Nomor Surat Resmi" />
                    {data.direction === 'outgoing' && !isEdit && (
                        <button
                            type="button"
                            onClick={onAutoGenerateNumber}
                            className="inline-flex items-center text-xs font-semibold text-emerald-700 hover:text-emerald-900"
                        >
                            <Sparkles className="w-3.5 h-3.5 me-1 text-emerald-600" />
                            Generate Nomor Otomatis
                        </button>
                    )}
                </div>
                <TextInput
                    id="letter_number"
                    value={data.letter_number}
                    placeholder="Contoh: 001/SPI/ST/X/2026"
                    className="mt-1 block w-full font-mono text-sm"
                    onChange={(e) => setData('letter_number', e.target.value)}
                    required
                />
                <InputError message={errors.letter_number} className="mt-1" />
            </div>

            <div>
                <InputLabel htmlFor="subject" value="Perihal Surat" />
                <TextInput
                    id="subject"
                    value={data.subject}
                    placeholder="Ringkasan perihal atau isi surat"
                    className="mt-1 block w-full"
                    onChange={(e) => setData('subject', e.target.value)}
                    required
                />
                <InputError message={errors.subject} className="mt-1" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <InputLabel htmlFor="sender" value="Asal Surat / Pengirim" />
                    <TextInput
                        id="sender"
                        value={data.sender}
                        placeholder="Nama pengirim atau instansi"
                        className="mt-1 block w-full"
                        onChange={(e) => setData('sender', e.target.value)}
                        required
                    />
                    <InputError message={errors.sender} className="mt-1" />
                </div>
                <div>
                    <InputLabel htmlFor="recipient" value="Tujuan Surat / Penerima (Nama/Jabatan)" />
                    <TextInput
                        id="recipient"
                        value={data.recipient}
                        placeholder="Pejabat / PIC penerima"
                        className="mt-1 block w-full"
                        onChange={(e) => setData('recipient', e.target.value)}
                        required
                    />
                    <InputError message={errors.recipient} className="mt-1" />
                </div>
            </div>

            <div>
                <InputLabel htmlFor="recipient_department_id" value="Departemen Tujuan (Unit Kerja Terkait)" />
                <select
                    id="recipient_department_id"
                    value={data.recipient_department_id}
                    onChange={(e) => setData('recipient_department_id', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-600 focus:ring-emerald-600 sm:text-sm"
                >
                    <option value="">-- Pilih Departemen Tujuan (Opsional) --</option>
                    {departments.map((dept) => (
                        <option key={dept.id} value={dept.id}>
                            {dept.code} - {dept.name}
                        </option>
                    ))}
                </select>
                <InputError message={errors.recipient_department_id} className="mt-1" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                    <InputLabel htmlFor="letter_date" value="Tanggal Surat" />
                    <TextInput
                        id="letter_date"
                        type="date"
                        value={data.letter_date}
                        className="mt-1 block w-full"
                        onChange={(e) => setData('letter_date', e.target.value)}
                        required
                    />
                    <InputError message={errors.letter_date} className="mt-1" />
                </div>
                <div>
                    <InputLabel htmlFor="received_date" value="Tanggal Diterima" />
                    <TextInput
                        id="received_date"
                        type="date"
                        value={data.received_date}
                        className="mt-1 block w-full"
                        onChange={(e) => setData('received_date', e.target.value)}
                    />
                </div>
                <div>
                    <InputLabel htmlFor="confidentiality" value="Kerahasiaan" />
                    <select
                        id="confidentiality"
                        value={data.confidentiality}
                        onChange={(e) => setData('confidentiality', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-600 focus:ring-emerald-600 sm:text-sm"
                    >
                        <option value="Biasa">Biasa</option>
                        <option value="Terbatas">Terbatas</option>
                        <option value="Rahasia">Rahasia</option>
                        <option value="Sangat Rahasia">Sangat Rahasia</option>
                    </select>
                </div>
            </div>
        </>
    );
}

