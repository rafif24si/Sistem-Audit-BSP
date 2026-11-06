import { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import { X, UserCheck } from 'lucide-react';

export default function EmployeeModal({ isOpen, onClose, employee = null, departments = [] }) {
    const isEdit = !!employee;

    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: '',
        email: '',
        department_id: '',
    });

    useEffect(() => {
        if (employee) {
            setData({
                name: employee.name || '',
                email: employee.email || '',
                department_id: employee.department_id ? String(employee.department_id) : '',
            });
        } else {
            reset();
            setData({
                name: '',
                email: '',
                department_id: '',
            });
        }
    }, [employee, isOpen]);

    if (!isOpen) return null;

    const submit = (e) => {
        e.preventDefault();
        if (isEdit) {
            put(route('employees.update', employee.id), {
                onSuccess: () => {
                    reset();
                    onClose();
                },
            });
        } else {
            post(route('employees.store'), {
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
                        <UserCheck className="h-5 w-5 text-emerald-300" />
                        <h3 className="text-base font-bold">
                            {isEdit ? 'Ubah Data Pegawai' : 'Tambah Pegawai Baru'}
                        </h3>
                    </div>
                    <button onClick={onClose} className="rounded-lg p-1 text-emerald-200 hover:bg-white/10">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={submit} className="p-6 space-y-4">
                    <div>
                        <InputLabel htmlFor="name" value="Nama Lengkap Pegawai" />
                        <TextInput
                            id="name"
                            value={data.name}
                            placeholder="Contoh: Bambang Irawan, ST"
                            className="mt-1 block w-full"
                            onChange={(e) => setData('name', e.target.value)}
                            required
                        />
                        <InputError message={errors.name} className="mt-1" />
                    </div>

                    <div>
                        <InputLabel htmlFor="email" value="Alamat Email Perusahaan" />
                        <TextInput
                            id="email"
                            type="email"
                            value={data.email}
                            placeholder="contoh: bambang.irawan@bsp.co.id"
                            className="mt-1 block w-full"
                            onChange={(e) => setData('email', e.target.value)}
                            required
                        />
                        <InputError message={errors.email} className="mt-1" />
                    </div>

                    <div>
                        <InputLabel htmlFor="department_id" value="Unit Kerja / Departemen" />
                        <select
                            id="department_id"
                            value={data.department_id}
                            onChange={(e) => setData('department_id', e.target.value)}
                            className="mt-1 block w-full rounded-lg border-gray-300 text-sm focus:border-emerald-600 focus:ring-emerald-600"
                        >
                            <option value="">-- Pilih Departemen (Opsional) --</option>
                            {departments.map((d) => (
                                <option key={d.id} value={d.id}>
                                    {d.code} - {d.name}
                                </option>
                            ))}
                        </select>
                        <InputError message={errors.department_id} className="mt-1" />
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
                            {processing ? 'Menyimpan...' : isEdit ? 'Simpan Perubahan' : 'Tambah Pegawai'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

