import { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import MeetingInviteesSection from '@/Components/Meetings/MeetingInviteesSection';
import MeetingModeLocationSection from '@/Components/Meetings/MeetingModeLocationSection';
import MeetingDateTimeSection from '@/Components/Meetings/MeetingDateTimeSection';
import { X, Calendar } from 'lucide-react';

export default function MeetingModal({ isOpen, onClose, meeting = null, allUsers = [] }) {
    const isEdit = !!meeting;

    const { data, setData, post, processing, errors, reset } = useForm({
        _method: isEdit ? 'PUT' : 'POST',
        title: '',
        meeting_type: 'Entry Meeting',
        meeting_mode: 'Offline',
        platform: 'Tatap Muka',
        meeting_date: new Date().toISOString().split('T')[0],
        start_time: '09:00',
        end_time: '11:00',
        location: '',
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
                meeting_mode: meeting.meeting_mode || 'Offline',
                platform: meeting.platform || (meeting.meeting_mode === 'Online' ? 'Zoom' : 'Tatap Muka'),
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
                meeting_mode: 'Offline',
                platform: 'Tatap Muka',
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

    const handleModeChange = (newMode) => {
        if (newMode === 'Offline') {
            setData((prev) => ({
                ...prev,
                meeting_mode: 'Offline',
                platform: 'Tatap Muka',
                location: prev.location.startsWith('http') ? 'Ruang Rapat SPI Lantai 3' : prev.location,
            }));
        } else {
            setData((prev) => ({
                ...prev,
                meeting_mode: 'Online',
                platform: prev.platform === 'Tatap Muka' ? 'Zoom' : prev.platform,
                location: prev.location.startsWith('Ruang') ? '' : prev.location,
            }));
        }
    };

    const addInvitee = (name) => {
        if (!name || data.invitees.includes(name)) return;
        setData('invitees', [...data.invitees, name]);
    };

    const removeInvitee = (index) => {
        setData('invitees', data.invitees.filter((_, i) => i !== index));
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

                    <MeetingModeLocationSection
                        meetingMode={data.meeting_mode}
                        platform={data.platform}
                        location={data.location}
                        onModeChange={handleModeChange}
                        onPlatformChange={(val) => setData('platform', val)}
                        onLocationChange={(val) => setData('location', val)}
                        errors={errors}
                    />

                    <MeetingDateTimeSection
                        data={data}
                        setData={setData}
                        errors={errors}
                    />

                    <MeetingInviteesSection
                        allUsers={allUsers}
                        invitees={data.invitees}
                        addInvitee={addInvitee}
                        removeInvitee={removeInvitee}
                        error={errors.invitees}
                    />

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
