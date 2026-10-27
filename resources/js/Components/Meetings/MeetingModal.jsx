import { useEffect, useState } from 'react';
import { useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { X, Calendar, Plus, Trash2 } from 'lucide-react';

export default function MeetingModal({ isOpen, onClose, meeting = null, allUsers = [] }) {
    const isEdit = !!meeting;
    const [customInvitee, setCustomInvitee] = useState('');

    const { data, setData, post, processing, errors, reset } = useForm({
        _method: isEdit ? 'PUT' : 'POST',
        title: '',
        meeting_type: 'Entry Meeting',
        meeting_date: new Date().toISOString().split('T')[0],
        start_time: '09:00',
        end_time: '11:00',
        location: 'Ruang Rapat SPI Lantai 3',
        invitees: [],
        confidentiality: 'Terbatas',
        status: 'Terjadwal',
        attachment: null,
    });

    useEffect(() => {
        if (meeting) {
            setData({
                _method: 'PUT',
                title: meeting.title || '',
                meeting_type: meeting.meeting_type || 'Entry Meeting',
                meeting_date: meeting.meeting_date ? meeting.meeting_date.substring(0, 10) : '',
                start_time: meeting.start_time || '09:00',
                end_time: meeting.end_time || '',
                location: meeting.location || '',
                invitees: Array.isArray(meeting.invitees) ? meeting.invitees : [],
                confidentiality: meeting.confidentiality || 'Terbatas',
                status: meeting.status || 'Terjadwal',
                attachment: null,
            });
        } else {
            reset();
            setData({
                _method: 'POST',
                title: '',
                meeting_type: 'Entry Meeting',
                meeting_date: new Date().toISOString().split('T')[0],
                start_time: '09:00',
                end_time: '11:00',
                location: 'Ruang Rapat SPI Lantai 3',
                invitees: allUsers.slice(0, 3).map((u) => u.name),
                confidentiality: 'Terbatas',
                status: 'Terjadwal',
                attachment: null,
            });
        }
    }, [meeting, isOpen]);

    if (!isOpen) return null;

    const addInvitee = (name) => {
        if (!name || data.invitees.includes(name)) return;
        setData('invitees', [...data.invitees, name]);
    };

    const removeInvitee = (index) => {
        setData('invitees', data.invitees.filter((_, i) => i !== index));
    };

    const handleAddCustom = (e) => {
        e.preventDefault();
        if (customInvitee.trim()) {
            addInvitee(customInvitee.trim());
            setCustomInvitee('');
        }
    };

    const submit = (e) => {
        e.preventDefault();
        const url = isEdit ? route('meetings.update', meeting.id) : route('meetings.store');
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
                    <div className="flex items-center space-x-2">
                        <Calendar className="h-5 w-5 text-emerald-300" />
                        <h3 className="text-base font-bold">
                            {isEdit ? 'Ubah Agenda Rapat' : 'Jadwalkan Rapat Audit Baru'}
                        </h3>
                    </div>
                    <button onClick={onClose} className="rounded-lg p-1 text-emerald-200 hover:bg-white/10">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={submit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
                    <div>
                        <InputLabel htmlFor="title" value="Perihal / Agenda Rapat" />
                        <TextInput
                            id="title"
                            value={data.title}
                            placeholder="Contoh: Entry Meeting Audit Lapangan Wilayah Kerja Riau"
                            className="mt-1 block w-full"
                            onChange={(e) => setData('title', e.target.value)}
                            required
                        />
                        <InputError message={errors.title} className="mt-1" />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <InputLabel htmlFor="meeting_type" value="Jenis Rapat Audit" />
                            <select
                                id="meeting_type"
                                value={data.meeting_type}
                                onChange={(e) => setData('meeting_type', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-600 focus:ring-emerald-600 sm:text-sm"
                            >
                                <option value="Entry Meeting">Entry Meeting</option>
                                <option value="Exit Meeting">Exit Meeting</option>
                                <option value="Rapat Internal SPI">Rapat Internal SPI</option>
                                <option value="Rapat Pimpinan">Rapat Pimpinan</option>
                            </select>
                        </div>
                        <div>
                            <InputLabel htmlFor="location" value="Lokasi / Tautan Online" />
                            <TextInput
                                id="location"
                                value={data.location}
                                placeholder="Ruang Rapat Utama / Link Teams"
                                className="mt-1 block w-full"
                                onChange={(e) => setData('location', e.target.value)}
                                required
                            />
                            <InputError message={errors.location} className="mt-1" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                            <InputLabel htmlFor="meeting_date" value="Tanggal Rapat" />
                            <TextInput
                                id="meeting_date"
                                type="date"
                                value={data.meeting_date}
                                className="mt-1 block w-full"
                                onChange={(e) => setData('meeting_date', e.target.value)}
                                required
                            />
                            <InputError message={errors.meeting_date} className="mt-1" />
                        </div>
                        <div>
                            <InputLabel htmlFor="start_time" value="Waktu Mulai" />
                            <TextInput
                                id="start_time"
                                type="time"
                                value={data.start_time}
                                className="mt-1 block w-full"
                                onChange={(e) => setData('start_time', e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <InputLabel htmlFor="end_time" value="Waktu Selesai (Est)" />
                            <TextInput
                                id="end_time"
                                type="time"
                                value={data.end_time}
                                className="mt-1 block w-full"
                                onChange={(e) => setData('end_time', e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <InputLabel htmlFor="confidentiality" value="Kerahasiaan Notulen" />
                            <select
                                id="confidentiality"
                                value={data.confidentiality}
                                onChange={(e) => setData('confidentiality', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-600 focus:ring-emerald-600 sm:text-sm"
                            >
                                <option value="Terbatas">Terbatas (Bawaan SPI)</option>
                                <option value="Biasa">Biasa</option>
                                <option value="Rahasia">Rahasia</option>
                            </select>
                        </div>
                        <div>
                            <InputLabel htmlFor="status" value="Status Rapat" />
                            <select
                                id="status"
                                value={data.status}
                                onChange={(e) => setData('status', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-600 focus:ring-emerald-600 sm:text-sm"
                            >
                                <option value="Terjadwal">Terjadwal</option>
                                <option value="Berlangsung">Berlangsung</option>
                                <option value="Selesai">Selesai</option>
                                <option value="Dibatalkan">Dibatalkan</option>
                            </select>
                        </div>
                    </div>

                    {/* Invitees selector */}
                    <div className="rounded-xl border border-gray-200 bg-slate-50/80 p-4 space-y-3">
                        <InputLabel value="Daftar Undangan / Peserta Rapat" />
                        <div className="flex gap-2">
                            <select
                                onChange={(e) => {
                                    if (e.target.value) {
                                        addInvitee(e.target.value);
                                        e.target.value = '';
                                    }
                                }}
                                className="flex-1 rounded-md border-gray-300 shadow-sm text-xs focus:border-emerald-600 focus:ring-emerald-600"
                            >
                                <option value="">Pilih dari Pengguna Sistem PT BSP...</option>
                                {allUsers.map((u) => (
                                    <option key={u.id} value={u.name}>
                                        {u.name} ({u.role.toUpperCase()} - {u.department?.code || 'BSP'})
                                    </option>
                                ))}
                            </select>
                            <input
                                type="text"
                                placeholder="Atau ketik nama/eksternal..."
                                value={customInvitee}
                                onChange={(e) => setCustomInvitee(e.target.value)}
                                onKeyDown={(e) => { if (e.key === 'Enter') handleAddCustom(e); }}
                                className="rounded-md border-gray-300 shadow-sm text-xs w-48"
                            />
                            <button
                                type="button"
                                onClick={handleAddCustom}
                                className="rounded-md bg-emerald-700 px-3 py-1.5 text-xs text-white hover:bg-emerald-800"
                            >
                                Tambah
                            </button>
                        </div>

                        <div className="flex flex-wrap gap-1.5 mt-2 max-h-24 overflow-y-auto">
                            {data.invitees.map((inv, idx) => (
                                <span
                                    key={idx}
                                    className="inline-flex items-center rounded-full bg-white px-2.5 py-1 text-xs font-medium text-gray-800 border border-gray-200 shadow-2xs"
                                >
                                    {inv}
                                    <button
                                        type="button"
                                        onClick={() => removeInvitee(idx)}
                                        className="ms-1.5 text-gray-400 hover:text-red-600"
                                    >
                                        &times;
                                    </button>
                                </span>
                            ))}
                        </div>
                        <InputError message={errors.invitees} className="mt-1" />
                    </div>

                    <div>
                        <InputLabel htmlFor="attachment" value="Lampiran Materi / Absensi Rapat (Maks. 10MB)" />
                        <input
                            id="attachment"
                            type="file"
                            accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.png"
                            onChange={(e) => setData('attachment', e.target.files[0])}
                            className="mt-1 block w-full text-xs text-slate-500 file:me-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                        />
                        <InputError message={errors.attachment} className="mt-1" />
                    </div>

                    <div className="flex items-center justify-end space-x-3 pt-3 border-t border-gray-100">
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
                            {processing ? 'Memproses...' : (isEdit ? 'Simpan Perubahan' : 'Jadwalkan Rapat')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
