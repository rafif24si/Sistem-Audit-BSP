import { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import LetterFollowUpSection from '@/Components/Letters/LetterFollowUpSection';
import LetterMainFields from '@/Components/Letters/LetterMainFields';
import { X } from 'lucide-react';

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
                    <LetterMainFields
                        data={data}
                        setData={setData}
                        errors={errors}
                        departments={departments}
                        isEdit={isEdit}
                        onAutoGenerateNumber={handleAutoGenerateNumber}
                    />

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
