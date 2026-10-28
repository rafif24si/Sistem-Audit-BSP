import { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { X, UserPlus, Shield } from 'lucide-react';

export default function UserModal({ isOpen, onClose, user = null, departments = [] }) {
    const isEdit = !!user;

    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        role: 'auditor',
        department_id: '',
    });

    useEffect(() => {
        if (user) {
            setData({
                name: user.name || '',
                email: user.email || '',
                password: '',
                role: user.role || 'auditor',
                department_id: user.department_id || '',
            });
        } else {
            reset();
            setData({
                name: '',
                email: '',
                password: '',
                role: 'auditor',
                department_id: departments[0]?.id || '',
            });
        }
    }, [user, isOpen]);

    if (!isOpen) return null;

    const submit = (e) => {
        e.preventDefault();
        if (isEdit) {
            put(route('users.update', user.id), {
                onSuccess: () => {
                    reset();
                    onClose();
                },
            });
        } else {
            post(route('users.store'), {
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
                        <UserPlus className="h-5 w-5 text-emerald-300" />
                        <h3 className="text-base font-bold">
                            {isEdit ? 'Ubah Akun Pengguna' : 'Tambah Pengguna Baru'}
                        </h3>
                    </div>
                    <button onClick={onClose} className="rounded-lg p-1 text-emerald-200 hover:bg-white/10">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={submit} className="p-6 space-y-4">
                    <div>
                        <InputLabel htmlFor="name" value="Nama Lengkap" />
                        <TextInput
                            id="name"
                            value={data.name}
                            placeholder="Contoh: Rendra Pratama, S.E."
                            className="mt-1 block w-full"
                            onChange={(e) => setData('name', e.target.value)}
                            required
                        />
                        <InputError message={errors.name} className="mt-1" />
                    </div>

                    <div>
                        <InputLabel htmlFor="email" value="Alamat Email PT BSP" />
                        <TextInput
                            id="email"
                            type="email"
                            value={data.email}
                            placeholder="nama@bsp.com"
                            className="mt-1 block w-full"
                            onChange={(e) => setData('email', e.target.value)}
                            required
                        />
                        <InputError message={errors.email} className="mt-1" />
                    </div>

                    <div>
                        <InputLabel
                            htmlFor="password"
                            value={isEdit ? 'Kata Sandi Baru (Kosongkan jika tidak diganti)' : 'Kata Sandi'}
                        />
                        <TextInput
                            id="password"
                            type="password"
                            value={data.password}
                            placeholder={isEdit ? '••••••••' : 'Minimal 8 karakter'}
                            className="mt-1 block w-full"
                            onChange={(e) => setData('password', e.target.value)}
                            required={!isEdit}
                        />
                        <InputError message={errors.password} className="mt-1" />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <InputLabel htmlFor="role" value="Peran Sistem (Role)" />
                            <select
                                id="role"
                                value={data.role}
                                onChange={(e) => setData('role', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-600 focus:ring-emerald-600 sm:text-sm"
                            >
                                <option value="super_admin">Super Admin</option>
                                <option value="manager_spi">Manager SPI</option>
                                <option value="auditor">Auditor / Staf SPI</option>
                                <option value="auditee">Auditee (PIC Dept)</option>
                            </select>
                            <InputError message={errors.role} className="mt-1" />
                        </div>

                        <div>
                            <InputLabel htmlFor="department_id" value="Unit Kerja / Departemen" />
                            <select
                                id="department_id"
                                value={data.department_id}
                                onChange={(e) => setData('department_id', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-600 focus:ring-emerald-600 sm:text-sm"
                            >
                                <option value="">Tanpa Departemen Khusus</option>
                                {departments.map((d) => (
                                    <option key={d.id} value={d.id}>
                                        {d.code} - {d.name}
                                    </option>
                                ))}
                            </select>
                            <InputError message={errors.department_id} className="mt-1" />
                        </div>
                    </div>

                    <div className="rounded-lg bg-emerald-50/60 p-3 text-xs text-emerald-800 flex items-start space-x-2 border border-emerald-100">
                        <Shield className="h-4 w-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span>
                            Role <strong>Super Admin</strong> memiliki akses manajemen sistem & user. Role <strong>Auditee</strong> hanya melihat data surat/dokumen terkait unit kerjanya.
                        </span>
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
                            {processing ? 'Menyimpan...' : (isEdit ? 'Simpan Perubahan' : 'Daftarkan Pengguna')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
