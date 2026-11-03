import { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import { X, Building2 } from 'lucide-react';

export default function DepartmentModal({ isOpen, onClose, department = null }) {
    const isEdit = !!department;

    const { data, setData, post, put, processing, errors, reset } = useForm({
        code: '',
        name: '',
    });

    useEffect(() => {
        if (department) {
            setData({
                code: department.code || '',
                name: department.name || '',
            });
        } else {
            reset();
            setData({
                code: '',
                name: '',
            });
        }
    }, [department, isOpen]);

    if (!isOpen) return null;

    const submit = (e) => {
        e.preventDefault();
        if (isEdit) {
            put(route('departments.update', department.id), {
                onSuccess: () => {
                    reset();
                    onClose();
                },
            });
        } else {
            post(route('departments.store'), {
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
                        <Building2 className="h-5 w-5 text-emerald-300" />
                        <h3 className="text-base font-bold">
                            {isEdit ? 'Ubah Master Departemen' : 'Tambah Departemen Baru'}
                        </h3>
                    </div>
                    <button onClick={onClose} className="rounded-lg p-1 text-emerald-200 hover:bg-white/10">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={submit} className="p-6 space-y-4">
                    <div>
                        <InputLabel htmlFor="code" value="Kode Departemen / Unit" />
                        <TextInput
                            id="code"
                            value={data.code}
                            placeholder="Contoh: SPI, QHSE, FIN, HRD"
                            className="mt-1 block w-full uppercase font-mono"
                            onChange={(e) => setData('code', e.target.value.toUpperCase())}
                            required
                        />
                        <InputError message={errors.code} className="mt-1" />
                    </div>

                    <div>
                        <InputLabel htmlFor="name" value="Nama Lengkap Departemen" />
                        <TextInput
                            id="name"
                            value={data.name}
                            placeholder="Contoh: Satuan Pengawasan Intern"
                            className="mt-1 block w-full"
                            onChange={(e) => setData('name', e.target.value)}
                            required
                        />
                        <InputError message={errors.name} className="mt-1" />
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
                            {processing ? 'Menyimpan...' : isEdit ? 'Simpan Perubahan' : 'Tambah Departemen'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

