import { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import { X, CheckCircle, XCircle, ShieldAlert } from 'lucide-react';

export default function ApprovalModal({ isOpen, onClose, letter = null }) {
    const { data, setData, patch, processing, errors, reset } = useForm({
        approval_status: 'approved',
        approval_notes: '',
    });

    useEffect(() => {
        if (letter) {
            setData({
                approval_status: letter.approval_status === 'rejected' ? 'rejected' : 'approved',
                approval_notes: letter.approval_notes || '',
            });
        } else {
            reset();
        }
    }, [letter, isOpen]);

    if (!isOpen || !letter) return null;

    const submit = (e) => {
        e.preventDefault();
        patch(route('letters.approve', letter.id), {
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
            <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl my-8 overflow-hidden">
                <div className="flex items-center justify-between border-b border-gray-100 bg-[#194f2b] px-6 py-4 text-white">
                    <div className="flex items-center space-x-2">
                        <ShieldAlert className="h-5 w-5 text-emerald-300" />
                        <h3 className="text-base font-bold">Persetujuan Surat Keluar (Approval)</h3>
                    </div>
                    <button onClick={onClose} className="rounded-lg p-1 text-emerald-200 hover:bg-white/10">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="p-6 bg-slate-50 border-b border-gray-100">
                    <div className="text-xs text-gray-500 font-mono">{letter.letter_number}</div>
                    <div className="text-sm font-semibold text-gray-900 mt-1">{letter.subject}</div>
                    <div className="text-xs text-gray-500 mt-1">
                        Tujuan: <span className="font-medium text-gray-700">{letter.recipient}</span>
                        {letter.recipient_department && ` (${letter.recipient_department.code})`}
                    </div>
                </div>

                <form onSubmit={submit} className="p-6 space-y-4">
                    <div>
                        <InputLabel value="Keputusan Persetujuan" />
                        <div className="grid grid-cols-2 gap-3 mt-2">
                            <label
                                className={`flex items-center justify-center p-3 rounded-xl border cursor-pointer transition-all ${
                                    data.approval_status === 'approved'
                                        ? 'border-emerald-600 bg-emerald-50/80 text-emerald-900 ring-2 ring-emerald-500/30'
                                        : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                                }`}
                            >
                                <input
                                    type="radio"
                                    name="approval_status"
                                    value="approved"
                                    checked={data.approval_status === 'approved'}
                                    onChange={(e) => setData('approval_status', e.target.value)}
                                    className="sr-only"
                                />
                                <CheckCircle className="h-4 w-4 me-2 text-emerald-600" />
                                <span className="text-sm font-semibold">Setujui Surat</span>
                            </label>

                            <label
                                className={`flex items-center justify-center p-3 rounded-xl border cursor-pointer transition-all ${
                                    data.approval_status === 'rejected'
                                        ? 'border-red-600 bg-red-50/80 text-red-900 ring-2 ring-red-500/30'
                                        : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                                }`}
                            >
                                <input
                                    type="radio"
                                    name="approval_status"
                                    value="rejected"
                                    checked={data.approval_status === 'rejected'}
                                    onChange={(e) => setData('approval_status', e.target.value)}
                                    className="sr-only"
                                />
                                <XCircle className="h-4 w-4 me-2 text-red-600" />
                                <span className="text-sm font-semibold">Tolak / Revisi</span>
                            </label>
                        </div>
                        <InputError message={errors.approval_status} className="mt-1" />
                    </div>

                    <div>
                        <InputLabel htmlFor="approval_notes" value="Catatan / Arahan Manager" />
                        <textarea
                            id="approval_notes"
                            rows="3"
                            value={data.approval_notes}
                            onChange={(e) => setData('approval_notes', e.target.value)}
                            placeholder="Tuliskan catatan persetujuan atau poin yang perlu direvisi..."
                            className="mt-1 block w-full rounded-lg border-gray-300 text-sm focus:border-emerald-600 focus:ring-emerald-600"
                        />
                        <InputError message={errors.approval_notes} className="mt-1" />
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
                            className={`rounded-lg px-4 py-2 text-sm font-semibold text-white shadow-sm disabled:opacity-75 ${
                                data.approval_status === 'rejected'
                                    ? 'bg-red-600 hover:bg-red-700'
                                    : 'bg-[#194f2b] hover:bg-[#123b20]'
                            }`}
                        >
                            {processing ? 'Menyimpan...' : 'Simpan Keputusan'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
