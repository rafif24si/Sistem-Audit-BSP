import { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import { X, DoorClosed } from 'lucide-react';

export default function MeetingRoomModal({ isOpen, onClose, meetingRoom = null }) {
    const isEdit = !!meetingRoom;

    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: '',
        capacity: '',
    });

    useEffect(() => {
        if (meetingRoom) {
            setData({
                name: meetingRoom.name || '',
                capacity: meetingRoom.capacity ?? '',
            });
        } else {
            reset();
            setData({
                name: '',
                capacity: '',
            });
        }
    }, [meetingRoom, isOpen]);

    if (!isOpen) return null;

    const submit = (e) => {
        e.preventDefault();
        if (isEdit) {
            put(route('meeting-rooms.update', meetingRoom.id), {
                onSuccess: () => {
                    reset();
                    onClose();
                },
            });
        } else {
            post(route('meeting-rooms.store'), {
                onSuccess: () => {
                    reset();
                    onClose();
                },
            });
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
            <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl my-8 overflow-hidden">
                <div className="flex items-center justify-between border-b border-gray-100 bg-[#194f2b] px-6 py-4 text-white">
                    <div className="flex items-center space-x-2">
                        <DoorClosed className="h-5 w-5 text-emerald-300" />
                        <h3 className="text-base font-bold">
                            {isEdit ? 'Ubah Ruangan Rapat' : 'Tambah Ruangan Rapat Baru'}
                        </h3>
                    </div>
                    <button onClick={onClose} className="rounded-lg p-1 text-emerald-200 hover:bg-white/10">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={submit} className="p-6 space-y-4">
                    <div>
                        <InputLabel htmlFor="name" value="Nama Ruangan Rapat" />
                        <TextInput
                            id="name"
                            value={data.name}
                            placeholder="Contoh: Ruang Rapat SPI Lantai 3, Ruang Komite Lt. 6"
                            className="mt-1 block w-full"
                            onChange={(e) => setData('name', e.target.value)}
                            required
                        />
                        <InputError message={errors.name} className="mt-1" />
                    </div>

                    <div>
                        <InputLabel htmlFor="capacity" value="Kapasitas Maksimal (Orang)" />
                        <TextInput
                            id="capacity"
                            type="number"
                            min="1"
                            max="1000"
                            value={data.capacity}
                            placeholder="Contoh: 20"
                            className="mt-1 block w-full"
                            onChange={(e) => setData('capacity', e.target.value)}
                        />
                        <p className="text-[11px] text-gray-500 mt-1">Opsional, masukkan perkiraan jumlah peserta yang dapat ditampung.</p>
                        <InputError message={errors.capacity} className="mt-1" />
                    </div>

                    <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-lg px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center rounded-lg bg-[#194f2b] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#123b20] disabled:opacity-50"
                        >
                            {processing ? 'Menyimpan...' : isEdit ? 'Simpan Perubahan' : 'Tambah Ruangan'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

