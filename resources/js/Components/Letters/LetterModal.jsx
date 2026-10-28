import { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import LetterFollowUpSection from '@/Components/Letters/LetterFollowUpSection';
import { X, Sparkles } from 'lucide-react';

export default function LetterModal({
    isOpen,
    onClose,
    letter = null,
    defaultScope = 'internal',
    departments = [],
}) {
    const isEdit = !!letter;

    const { data, setData, post, processing, errors, reset } = useForm({
        _method: isEdit ? 'PUT' : 'POST',
        scope: defaultScope,
        direction: 'incoming',
        agenda_number: '',
        letter_number: '',
        letter_type_code: 'ST',
        subject: '',
        sender: '',
        recipient: '',
        recipient_department_id: '',
        letter_date: new Date().toISOString().split('T')[0],
        received_date: '',
        confidentiality: 'Terbatas',
        followup_status: defaultScope === 'external' ? 'pending' : 'not_required',
        followup_notes: '',
        followup_due_date: '',
        file: null,
    });

    useEffect(() => {
        if (letter) {
            setData({
                _method: 'PUT',
                scope: letter.scope || defaultScope,
                direction: letter.direction || 'incoming',
                agenda_number: letter.agenda_number || '',
                letter_number: letter.letter_number || '',
                letter_type_code: letter.letter_type_code || 'ST',
                subject: letter.subject || '',
                sender: letter.sender || '',
                recipient: letter.recipient || '',
                recipient_department_id: letter.recipient_department_id || '',
                letter_date: letter.letter_date ? letter.letter_date.substring(0, 10) : '',
                received_date: letter.received_date ? letter.received_date.substring(0, 10) : '',
                confidentiality: letter.confidentiality || 'Terbatas',
                followup_status: letter.followup_status || 'not_required',
                followup_notes: letter.followup_notes || '',
                followup_due_date: letter.followup_due_date ? letter.followup_due_date.substring(0, 10) : '',
                file: null,
            });
        } else {
            reset();
            setData({
                _method: 'POST',
                scope: defaultScope,
                direction: 'incoming',
                letter_type_code: 'ST',
                confidentiality: 'Terbatas',
                recipient_department_id: '',
                letter_date: new Date().toISOString().split('T')[0],
                followup_status: defaultScope === 'external' ? 'pending' : 'not_required',
            });
        }
    }, [letter, isOpen, defaultScope]);

    if (!isOpen) return null;

    const handleAutoGenerateNumber = async () => {
        try {
            const res = await fetch(
                route('letters.generate-number', {
                    letter_type_code: data.letter_type_code,
                    letter_date: data.letter_date,
                })
            );
            const result = await res.json();
            if (result.letter_number) setData('letter_number', result.letter_number);
        } catch (err) {
            console.error(err);
        }
    };

    const submit = (e) => {
        e.preventDefault();
        const url = isEdit ? route('letters.update', letter.id) : route('letters.store');
        post(url, {
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
            <div className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl my-8 overflow-hidden">
                <div className="flex items-center justify-between border-b border-gray-100 bg-[#194f2b] px-6 py-4 text-white">
                    <h3 className="text-base font-bold">
                        {isEdit ? 'Ubah Data Surat' : `Tambah Surat ${data.scope === 'external' ? 'Eksternal' : 'Internal'}`}
                    </h3>
                    <button onClick={onClose} className="rounded-lg p-1 text-emerald-200 hover:bg-white/10">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={submit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
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
                                    onClick={handleAutoGenerateNumber}
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

                    <LetterFollowUpSection data={data} setData={setData} />

                    <div>
                        <InputLabel htmlFor="file" value="File Lampiran Surat (Maks. 10MB)" />
                        <input
                            id="file"
                            type="file"
                            accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.png"
                            onChange={(e) => setData('file', e.target.files[0])}
                            className="mt-1 block w-full text-xs text-slate-500 file:me-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                        />
                        <InputError message={errors.file} className="mt-1" />
                    </div>

                    <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-lg bg-[#194f2b] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#123b20] disabled:opacity-75"
                        >
                            {processing ? 'Memproses...' : (isEdit ? 'Simpan Perubahan' : 'Simpan Surat')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
