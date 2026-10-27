import { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { X, Sparkles } from 'lucide-react';

export default function DocumentModal({ isOpen, onClose, document = null, departments = [] }) {
    const isEdit = !!document;

    const { data, setData, post, processing, errors, reset } = useForm({
        _method: isEdit ? 'PUT' : 'POST',
        document_number: '',
        title: '',
        department_id: departments[0]?.id || '',
        document_type: 'SOP',
        version: '00',
        effective_date: new Date().toISOString().split('T')[0],
        expired_date: '',
        control_status: 'TERKENDALI',
        confidentiality: 'Terbatas',
        file: null,
    });

    useEffect(() => {
        if (document) {
            setData({
                _method: 'PUT',
                document_number: document.document_number || '',
                title: document.title || '',
                department_id: document.department_id || departments[0]?.id || '',
                document_type: document.document_type || 'SOP',
                version: document.version || '00',
                effective_date: document.effective_date ? document.effective_date.substring(0, 10) : '',
                expired_date: document.expired_date ? document.expired_date.substring(0, 10) : '',
                control_status: document.control_status || 'TERKENDALI',
                confidentiality: document.confidentiality || 'Terbatas',
                file: null,
            });
        } else {
            reset();
            setData('_method', 'POST');
        }
    }, [document, isOpen]);

    if (!isOpen) return null;

    const handleAutoGenerateNumber = async () => {
        if (!data.department_id) return;
        try {
            const res = await fetch(
                route('documents.generate-number', {
                    department_id: data.department_id,
                    document_type: data.document_type,
                })
            );
            const result = await res.json();
            if (result.document_number) {
                setData('document_number', result.document_number);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const submit = (e) => {
        e.preventDefault();
        const url = isEdit ? route('documents.update', document.id) : route('documents.store');
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
                        {isEdit ? 'Ubah Dokumen Master' : 'Tambah Dokumen Master Baru'}
                    </h3>
                    <button onClick={onClose} className="rounded-lg p-1 text-emerald-200 hover:bg-white/10">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={submit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <InputLabel htmlFor="department_id" value="Departemen Pemilik" />
                            <select
                                id="department_id"
                                value={data.department_id}
                                onChange={(e) => setData('department_id', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-600 focus:ring-emerald-600 sm:text-sm"
                            >
                                {departments.map((d) => (
                                    <option key={d.id} value={d.id}>{d.name} ({d.code})</option>
                                ))}
                            </select>
                            <InputError message={errors.department_id} className="mt-1" />
                        </div>

                        <div>
                            <InputLabel htmlFor="document_type" value="Tipe Dokumen" />
                            <select
                                id="document_type"
                                value={data.document_type}
                                onChange={(e) => setData('document_type', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-600 focus:ring-emerald-600 sm:text-sm"
                            >
                                <option value="SOP">SOP (Standar Operasional Prosedur)</option>
                                <option value="MAN">MAN (Manual)</option>
                                <option value="WI">WI (Work Instruction)</option>
                                <option value="FORM">FORM (Formulir)</option>
                            </select>
                            <InputError message={errors.document_type} className="mt-1" />
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between">
                            <InputLabel htmlFor="document_number" value="Nomor Dokumen" />
                            {!isEdit && (
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
                            id="document_number"
                            value={data.document_number}
                            placeholder="Contoh: QHSE-BSP/SOP/001"
                            className="mt-1 block w-full font-mono text-sm"
                            onChange={(e) => setData('document_number', e.target.value)}
                            required
                        />
                        <InputError message={errors.document_number} className="mt-1" />
                    </div>

                    <div>
                        <InputLabel htmlFor="title" value="Judul Dokumen" />
                        <TextInput
                            id="title"
                            value={data.title}
                            placeholder="Contoh: Prosedur Audit Internal K3 & Mutu"
                            className="mt-1 block w-full"
                            onChange={(e) => setData('title', e.target.value)}
                            required
                        />
                        <InputError message={errors.title} className="mt-1" />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                            <InputLabel htmlFor="version" value="Versi Revisi" />
                            <TextInput
                                id="version"
                                value={data.version}
                                placeholder="00"
                                className="mt-1 block w-full text-center"
                                onChange={(e) => setData('version', e.target.value)}
                                required
                            />
                            <InputError message={errors.version} className="mt-1" />
                        </div>
                        <div>
                            <InputLabel htmlFor="control_status" value="Status Dokumen" />
                            <select
                                id="control_status"
                                value={data.control_status}
                                onChange={(e) => setData('control_status', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-600 focus:ring-emerald-600 sm:text-sm"
                            >
                                <option value="TERKENDALI">TERKENDALI</option>
                                <option value="TIDAK_TERKENDALI">TIDAK TERKENDALI</option>
                                <option value="KADALUARSA">KADALUARSA</option>
                            </select>
                            <InputError message={errors.control_status} className="mt-1" />
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
                            <InputError message={errors.confidentiality} className="mt-1" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <InputLabel htmlFor="effective_date" value="Tanggal Berlaku" />
                            <TextInput
                                id="effective_date"
                                type="date"
                                value={data.effective_date}
                                className="mt-1 block w-full"
                                onChange={(e) => setData('effective_date', e.target.value)}
                                required
                            />
                            <InputError message={errors.effective_date} className="mt-1" />
                        </div>
                        <div>
                            <InputLabel htmlFor="expired_date" value="Batas Kadaluarsa (Opsional)" />
                            <TextInput
                                id="expired_date"
                                type="date"
                                value={data.expired_date}
                                className="mt-1 block w-full"
                                onChange={(e) => setData('expired_date', e.target.value)}
                            />
                            <InputError message={errors.expired_date} className="mt-1" />
                        </div>
                    </div>

                    <div>
                        <InputLabel htmlFor="file" value={isEdit ? 'Ganti File Lampiran (Kosongkan jika tidak diubah)' : 'Unggah File Dokumen (Maks. 10MB)'} />
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
                            {processing ? 'Memproses...' : (isEdit ? 'Simpan Perubahan' : 'Tambah Dokumen')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
