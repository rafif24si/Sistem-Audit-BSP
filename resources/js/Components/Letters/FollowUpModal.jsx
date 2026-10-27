import { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import { X, CheckCircle } from 'lucide-react';

export default function FollowUpModal({ isOpen, onClose, letter }) {
    const { data, setData, patch, processing, errors, reset } = useForm({
        followup_status: 'pending',
        followup_notes: '',
        followup_due_date: '',
    });

    useEffect(() => {
        if (letter) {
            setData({
                followup_status: letter.followup_status || 'pending',
                followup_notes: letter.followup_notes || '',
                followup_due_date: letter.followup_due_date ? letter.followup_due_date.substring(0, 10) : '',
            });
        }
    }, [letter, isOpen]);

    if (!isOpen || !letter) return null;

    const submit = (e) => {
        e.preventDefault();
        patch(route('letters.update-followup', letter.id), {
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl overflow-hidden">
                <div className="flex items-center justify-between border-b border-gray-100 bg-[#194f2b] px-6 py-4 text-white">
                    <div className="flex items-center space-x-2">
                        <CheckCircle className="h-5 w-5 text-emerald-300" />
                        <h3 className="text-base font-bold">Pembaruan Tindak Lanjut</h3>
                    </div>
                    <button onClick={onClose} className="rounded-lg p-1 text-emerald-200 hover:bg-white/10">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={submit} className="p-6 space-y-4">
                    <div className="rounded-lg bg-slate-50 p-3 text-xs text-slate-700 border border-slate-200">
                        <div className="font-semibold">{letter.letter_number}</div>
                        <div className="text-slate-500 truncate mt-0.5">{letter.subject}</div>
                    </div>

                    <div>
                        <InputLabel htmlFor="followup_status" value="Status Tindak Lanjut" />
                        <select
                            id="followup_status"
                            value={data.followup_status}
                            onChange={(e) => setData('followup_status', e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-600 focus:ring-emerald-600 sm:text-sm"
                        >
                            <option value="pending">Belum Tindak Lanjut (Pending)</option>
                            <option value="in_progress">Dalam Proses (In Progress)</option>
                            <option value="completed">Selesai (Completed)</option>
                            <option value="not_required">Tidak Perlu</option>
                        </select>
                        <InputError message={errors.followup_status} className="mt-1" />
                    </div>

                    <div>
                        <InputLabel htmlFor="followup_due_date" value="Tenggat Waktu Penyelesaian" />
                        <TextInput
                            id="followup_due_date"
                            type="date"
                            value={data.followup_due_date}
                            className="mt-1 block w-full"
                            onChange={(e) => setData('followup_due_date', e.target.value)}
                        />
                        <InputError message={errors.followup_due_date} className="mt-1" />
                    </div>

                    <div>
                        <InputLabel htmlFor="followup_notes" value="Catatan Hasil Tindak Lanjut" />
                        <textarea
                            id="followup_notes"
                            rows={3}
                            value={data.followup_notes}
                            placeholder="Tuliskan ringkasan perkembangan atau hasil tindak lanjut..."
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-600 focus:ring-emerald-600 sm:text-sm"
                            onChange={(e) => setData('followup_notes', e.target.value)}
                        />
                        <InputError message={errors.followup_notes} className="mt-1" />
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
                            {processing ? 'Memproses...' : 'Simpan Status'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
