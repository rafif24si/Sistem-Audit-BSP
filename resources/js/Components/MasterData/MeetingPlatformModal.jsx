import { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import { X, Video } from 'lucide-react';

export default function MeetingPlatformModal({ isOpen, onClose, meetingPlatform = null }) {
    const isEdit = !!meetingPlatform;

    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: '',
        is_active: true,
    });

    useEffect(() => {
        if (meetingPlatform) {
            setData({
                name: meetingPlatform.name || '',
                is_active: meetingPlatform.is_active ?? true,
            });
        } else {
            reset();
            setData({
                name: '',
                is_active: true,
            });
        }
    }, [meetingPlatform, isOpen]);

    if (!isOpen) return null;

    const submit = (e) => {
        e.preventDefault();
        if (isEdit) {
            put(route('meeting-platforms.update', meetingPlatform.id), {
                onSuccess: () => {
                    reset();
                    onClose();
                },
            });
        } else {
            post(route('meeting-platforms.store'), {
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
                        <Video className="h-5 w-5 text-emerald-300" />
                        <h3 className="text-base font-bold">
                            {isEdit ? 'Ubah Platform Meeting Online' : 'Tambah Platform Meeting Baru'}
                        </h3>
                    </div>
                    <button onClick={onClose} className="rounded-lg p-1 text-emerald-200 hover:bg-white/10">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={submit} className="p-6 space-y-4">
                    <div>
                        <InputLabel htmlFor="name" value="Nama Platform Meeting Online" />
                        <TextInput
                            id="name"
                            value={data.name}
                            placeholder="Contoh: Zoom Meeting, Google Meet, Microsoft Teams"
                            className="mt-1 block w-full"
                            onChange={(e) => setData('name', e.target.value)}
                            required
                        />
                        <InputError message={errors.name} className="mt-1" />
                    </div>

                    <div className="pt-2">
                        <label className="flex items-center space-x-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={data.is_active}
                                onChange={(e) => setData('is_active', e.target.checked)}
                                className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                            />
                            <div>
                                <span className="text-sm font-semibold text-gray-800">Status Platform Aktif</span>
                                <p className="text-xs text-gray-500">
                                    Jika diaktifkan, platform ini akan muncul sebagai opsi pilihan di formulir rapat online.
                                </p>
                            </div>
                        </label>
                        <InputError message={errors.is_active} className="mt-1" />
                    </div>

                    <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center rounded-lg bg-[#194f2b] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#123b20] disabled:opacity-50"
                        >
                            {processing ? 'Menyimpan...' : isEdit ? 'Simpan Perubahan' : 'Tambah Platform'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

