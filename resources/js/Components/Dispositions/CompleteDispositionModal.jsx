import { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import { X, CheckSquare } from 'lucide-react';

export default function CompleteDispositionModal({ isOpen, onClose, disposition }) {
    const { data, setData, patch, processing, errors, reset } = useForm({
        status: 'in_progress',
        completion_notes: '',
    });

    useEffect(() => {
        if (disposition) {
            setData({
                status: disposition.status || 'in_progress',
                completion_notes: disposition.completion_notes || '',
            });
        }
    }, [disposition, isOpen]);

    if (!isOpen || !disposition) return null;

    const submit = (e) => {
        e.preventDefault();
        patch(route('dispositions.update-status', disposition.id), {
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
                        <CheckSquare className="h-5 w-5 text-emerald-300" />
                        <h3 className="text-base font-bold">Laporan Tindak Lanjut Disposisi</h3>
                    </div>
                    <button onClick={onClose} className="rounded-lg p-1 text-emerald-200 hover:bg-white/10">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={submit} className="p-6 space-y-4">
                    <div className="rounded-lg bg-slate-50 p-3 text-xs text-slate-700 border border-slate-200 space-y-1">
                        <div><span className="font-semibold text-gray-500">Surat:</span> {disposition.letter?.letter_number}</div>
                        <div><span className="font-semibold text-gray-500">Perihal:</span> {disposition.letter?.subject}</div>
                        <div><span className="font-semibold text-gray-500">Instruksi:</span> <span className="font-bold text-emerald-800">{disposition.instruction}</span></div>
                    </div>

                    <div>
                        <InputLabel htmlFor="status" value="Status Progres Disposisi" />
                        <select
                            id="status"
                            value={data.status}
                            onChange={(e) => setData('status', e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-600 focus:ring-emerald-600 sm:text-sm"
                        >
                            <option value="pending">Belum Diproses (Pending)</option>
                            <option value="in_progress">Sedang Diproses (In Progress)</option>
                            <option value="completed">Selesai Ditindaklanjuti (Completed)</option>
                        </select>
                        <InputError message={errors.status} className="mt-1" />
                    </div>

                    <div>
                        <InputLabel htmlFor="completion_notes" value="Laporan Hasil / Bukti Tindak Lanjut" />
                        <textarea
                            id="completion_notes"
                            rows={3}
                            value={data.completion_notes}
                            placeholder="Jelaskan tindakan yang telah diambil atau nomor surat balasan..."
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-600 focus:ring-emerald-600 sm:text-sm"
                            onChange={(e) => setData('completion_notes', e.target.value)}
                        />
                        <InputError message={errors.completion_notes} className="mt-1" />
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
                            {processing ? 'Memproses...' : 'Simpan Laporan'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
