import { useState, useEffect } from 'react';
import { useForm, router } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import { UserCheck, Calendar, AlertTriangle, ShieldCheck, UserX } from 'lucide-react';

export default function PjsAssignmentCard({ user }) {
    const isSuperAdmin = user?.role === 'super_admin';

    const { data, setData, post, processing, errors, reset } = useForm({
        pjs_role: user?.pjs_role || 'manager_spi',
        pjs_start_date: user?.pjs_start_date ? user.pjs_start_date.substring(0, 10) : new Date().toISOString().split('T')[0],
        pjs_end_date: user?.pjs_end_date ? user.pjs_end_date.substring(0, 10) : '',
    });

    useEffect(() => {
        if (user) {
            setData({
                pjs_role: user.pjs_role || 'manager_spi',
                pjs_start_date: user.pjs_start_date ? user.pjs_start_date.substring(0, 10) : new Date().toISOString().split('T')[0],
                pjs_end_date: user.pjs_end_date ? user.pjs_end_date.substring(0, 10) : '',
            });
        }
    }, [user]);

    const today = new Date().toISOString().split('T')[0];
    const isExpired = user?.pjs_end_date && today > user.pjs_end_date.substring(0, 10);
    const isScheduled = user?.pjs_start_date && today < user.pjs_start_date.substring(0, 10);
    const isActive = user?.pjs_role && !isExpired && !isScheduled;

    const handleAssignPjs = (e) => {
        e.preventDefault();
        post(route('permissions.update-pjs', user.id), {
            preserveScroll: true,
        });
    };

    const handleRevokePjs = () => {
        if (confirm(`Yakin ingin mencabut penugasan PJS dari ${user.name}?`)) {
            router.delete(route('permissions.revoke-pjs', user.id), {
                preserveScroll: true,
            });
        }
    };

    if (isSuperAdmin) return null;

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-gray-100 gap-3">
                <div className="flex items-center space-x-2">
                    <UserCheck className="h-5 w-5 text-emerald-700" />
                    <div>
                        <h3 className="text-base font-bold text-gray-900">Penugasan PJS (Penanggung Jawab Sementara)</h3>
                        <p className="text-xs text-gray-500 mt-0.5">
                            Melimpahkan wewenang manajerial dan persetujuan surat/disposisi dalam rentang waktu terikat
                        </p>
                    </div>
                </div>

                <div>
                    {isActive ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                            <ShieldCheck className="h-3.5 w-3.5 me-1 text-emerald-600" />
                            PJS AKTIF ({user.pjs_role === 'manager_spi' ? 'Manager SPI' : user.pjs_role})
                        </span>
                    ) : isExpired ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">
                            <AlertTriangle className="h-3.5 w-3.5 me-1 text-rose-600" />
                            PJS KEDALUWARSA (Otomatis Gugur)
                        </span>
                    ) : isScheduled ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-300">
                            <Calendar className="h-3.5 w-3.5 me-1 text-blue-600" />
                            PJS TERJADWAL
                        </span>
                    ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
                            Tidak Ditugaskan PJS
                        </span>
                    )}
                </div>
            </div>

            <form onSubmit={handleAssignPjs} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                        <InputLabel htmlFor="pjs_role" value="Jabatan PJS yang Ditugaskan" />
                        <select
                            id="pjs_role"
                            value={data.pjs_role}
                            onChange={(e) => setData('pjs_role', e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-600 focus:ring-emerald-600 sm:text-xs font-semibold"
                        >
                            <option value="manager_spi">Manager SPI (Satuan Pengawasan Intern)</option>
                        </select>
                        <InputError message={errors.pjs_role} className="mt-1" />
                    </div>

                    <div>
                        <InputLabel htmlFor="pjs_start_date" value="Tanggal Mulai Tugas" />
                        <TextInput
                            id="pjs_start_date"
                            type="date"
                            value={data.pjs_start_date}
                            className="mt-1 block w-full text-xs"
                            onChange={(e) => setData('pjs_start_date', e.target.value)}
                            required
                        />
                        <InputError message={errors.pjs_start_date} className="mt-1" />
                    </div>

                    <div>
                        <InputLabel htmlFor="pjs_end_date" value="Tanggal Selesai Tugas" />
                        <TextInput
                            id="pjs_end_date"
                            type="date"
                            value={data.pjs_end_date}
                            className="mt-1 block w-full text-xs"
                            onChange={(e) => setData('pjs_end_date', e.target.value)}
                            required
                        />
                        <InputError message={errors.pjs_end_date} className="mt-1" />
                    </div>
                </div>

                <div className="rounded-xl bg-emerald-50/70 border border-emerald-200 p-3 text-xs text-emerald-900 leading-relaxed">
                    <strong>Ketentuan Otoritas PJS:</strong> Pengguna yang ditugaskan sebagai PJS akan memiliki hak akses penuh setara <em>Manager SPI</em> (menyetujui konsep surat keluar, menerbitkan disposisi, memimpin rapat). Setelah tanggal akhir penugasan terlewati, sistem secara otomatis menggugurkan seluruh hak akses PJS tersebut.
                </div>

                <div className="flex items-center justify-between pt-2">
                    {user?.pjs_role && (
                        <button
                            type="button"
                            onClick={handleRevokePjs}
                            className="inline-flex items-center text-xs font-semibold text-rose-700 hover:text-rose-900 hover:bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-200 transition"
                        >
                            <UserX className="h-3.5 w-3.5 me-1" />
                            Cabut Status PJS
                        </button>
                    )}
                    <div className="ms-auto">
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center rounded-lg bg-[#194f2b] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#123b20] transition disabled:opacity-75"
                        >
                            <UserCheck className="h-4 w-4 me-1.5" />
                            {processing ? 'Menyimpan PJS...' : 'Tetapkan Penugasan PJS'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}

