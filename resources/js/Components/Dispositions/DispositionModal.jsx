import { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { X, Send } from 'lucide-react';

export default function DispositionModal({
    isOpen,
    onClose,
    disposition = null,
    incomingLetters = [],
    staffUsers = [],
}) {
    const isEdit = !!disposition;

    const { data, setData, post, put, processing, errors, reset } = useForm({
        letter_id: incomingLetters[0]?.id || '',
        to_user_id: staffUsers[0]?.id || '',
        urgency: 'Biasa',
        instruction: 'Ditindaklanjuti',
        due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        notes: '',
    });

    useEffect(() => {
        if (disposition) {
            setData({
                letter_id: disposition.letter_id || '',
                to_user_id: disposition.to_user_id || '',
                urgency: disposition.urgency || 'Biasa',
                instruction: disposition.instruction || 'Ditindaklanjuti',
                due_date: disposition.due_date ? disposition.due_date.substring(0, 10) : '',
                notes: disposition.notes || '',
            });
        } else {
            reset();
            setData({
                letter_id: incomingLetters[0]?.id || '',
                to_user_id: staffUsers[0]?.id || '',
                urgency: 'Biasa',
                instruction: 'Ditindaklanjuti',
                due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                notes: '',
            });
        }
    }, [disposition, isOpen]);

    if (!isOpen) return null;

    const submit = (e) => {
        e.preventDefault();
        if (isEdit) {
            put(route('dispositions.update', disposition.id), {
                onSuccess: () => {
                    reset();
                    onClose();
                },
            });
        } else {
            post(route('dispositions.store'), {
                onSuccess: () => {
                    reset();
                    onClose();
                },
            });
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
            <div className="relative w-full max-w-xl rounded-2xl bg-white shadow-2xl my-8 overflow-hidden">
                <div className="flex items-center justify-between border-b border-gray-100 bg-[#194f2b] px-6 py-4 text-white">
                    <div className="flex items-center space-x-2">
                        <Send className="h-5 w-5 text-emerald-300" />
                        <h3 className="text-base font-bold">
                            {isEdit ? 'Ubah Lembar Disposisi' : 'Terbitkan Lembar Disposisi Digital'}
                        </h3>
                    </div>
                    <button onClick={onClose} className="rounded-lg p-1 text-emerald-200 hover:bg-white/10">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={submit} className="p-6 space-y-4">
                    <div>
                        <InputLabel htmlFor="letter_id" value="Pilih Surat yang Didisposisikan" />
                        <select
                            id="letter_id"
                            value={data.letter_id}
                            disabled={isEdit}
                            onChange={(e) => setData('letter_id', e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-600 focus:ring-emerald-600 sm:text-sm disabled:bg-gray-100"
                        >
                            {incomingLetters.length === 0 ? (
                                <option value="">Tidak ada surat masuk tercatat</option>
                            ) : (
                                incomingLetters.map((l) => (
                                    <option key={l.id} value={l.id}>
                                        {l.letter_number} — {l.subject} ({l.sender})
                                    </option>
                                ))
                            )}
                        </select>
                        <InputError message={errors.letter_id} className="mt-1" />
                    </div>

                    <div>
                        <InputLabel htmlFor="to_user_id" value="Diteruskan Kepada (Auditor / Staf SPI)" />
                        <select
                            id="to_user_id"
                            value={data.to_user_id}
                            onChange={(e) => setData('to_user_id', e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-600 focus:ring-emerald-600 sm:text-sm"
                        >
                            {staffUsers.map((u) => (
                                <option key={u.id} value={u.id}>
                                    {u.name} — {u.role.toUpperCase()} {u.department ? `(${u.department.code})` : ''}
                                </option>
                            ))}
                        </select>
                        <InputError message={errors.to_user_id} className="mt-1" />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <InputLabel htmlFor="urgency" value="Derajat Kecepatan" />
                            <select
                                id="urgency"
                                value={data.urgency}
                                onChange={(e) => setData('urgency', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-600 focus:ring-emerald-600 sm:text-sm"
                            >
                                <option value="Biasa">Biasa</option>
                                <option value="Segera">Segera</option>
                                <option value="Kilat">Kilat</option>
                            </select>
                            <InputError message={errors.urgency} className="mt-1" />
                        </div>
                        <div>
                            <InputLabel htmlFor="instruction" value="Instruksi Pimpinan" />
                            <select
                                id="instruction"
                                value={data.instruction}
                                onChange={(e) => setData('instruction', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-600 focus:ring-emerald-600 sm:text-sm"
                            >
                                <option value="Ditindaklanjuti">Ditindaklanjuti</option>
                                <option value="Untuk Diketahui">Untuk Diketahui</option>
                                <option value="Dibalas">Dibalas</option>
                                <option value="Dikoordinasikan">Dikoordinasikan</option>
                                <option value="DipelaJari">DipelaJari</option>
                                <option value="Diarsipkan">Diarsipkan</option>
                            </select>
                            <InputError message={errors.instruction} className="mt-1" />
                        </div>
                    </div>

                    <div>
                        <InputLabel htmlFor="due_date" value="Tenggat Waktu Penyelesaian" />
                        <TextInput
                            id="due_date"
                            type="date"
                            value={data.due_date}
                            className="mt-1 block w-full"
                            onChange={(e) => setData('due_date', e.target.value)}
                            required
                        />
                        <InputError message={errors.due_date} className="mt-1" />
                    </div>

                    <div>
                        <InputLabel htmlFor="notes" value="Catatan Tambahan / Arahan Khusus" />
                        <textarea
                            id="notes"
                            rows={3}
                            value={data.notes}
                            placeholder="Tuliskan arahan spesifik Manager SPI untuk staf..."
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-600 focus:ring-emerald-600 sm:text-sm"
                            onChange={(e) => setData('notes', e.target.value)}
                        />
                        <InputError message={errors.notes} className="mt-1" />
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
                            {processing ? 'Memproses...' : (isEdit ? 'Simpan Perubahan' : 'Terbitkan Disposisi')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
