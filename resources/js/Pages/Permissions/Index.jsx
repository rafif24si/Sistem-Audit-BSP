import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import PermissionCrudMatrix from '@/Components/Permissions/PermissionCrudMatrix';
import PjsAssignmentCard from '@/Components/Permissions/PjsAssignmentCard';
import { ShieldCheck, Search, Users, User, Building, ArrowRight } from 'lucide-react';

export default function Index({ users = [], selectedUser = null, permissions = [], filters = {} }) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSelectUser = (user) => {
        router.get(
            route('permissions.index'),
            { user_id: user.id, search },
            { preserveState: true, replace: true }
        );
    };

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(
            route('permissions.index'),
            { search, user_id: selectedUser?.id },
            { preserveState: true, replace: true }
        );
    };

    const getRoleBadge = (role) => {
        switch (role) {
            case 'super_admin':
                return <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800">Super Admin</span>;
            case 'manager_spi':
                return <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">Manager SPI</span>;
            case 'auditor':
                return <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">Auditor SPI</span>;
            default:
                return <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">Auditee</span>;
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h2 className="text-xl font-bold text-gray-900 leading-tight">
                        Manajemen Hak Akses Dinamis & PJS
                    </h2>
                    <p className="text-xs text-gray-500 mt-0.5">
                        Otoritas Super Admin: Pemisahan modul identitas akun, konfigurasi matriks CRUD per user, dan pelimpahan wewenang PJS
                    </p>
                </div>
            }
        >
            <Head title="Kelola Hak Akses & PJS - SPI PT BSP" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Column: User Selection Directory */}
                <div className="lg:col-span-4 space-y-4">
                    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-3">
                            <div className="flex items-center space-x-2">
                                <Users className="h-4 w-4 text-emerald-700" />
                                <h3 className="text-sm font-bold text-gray-900">Daftar Pengguna ({users.length})</h3>
                            </div>
                        </div>

                        <form onSubmit={handleSearch} className="relative mb-3">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Cari nama atau email..."
                                className="w-full pl-9 pr-3 py-1.5 rounded-lg border-gray-300 text-xs focus:border-emerald-600 focus:ring-emerald-600"
                            />
                        </form>

                        <div className="space-y-1.5 max-h-[70vh] overflow-y-auto pr-1">
                            {users.length === 0 ? (
                                <div className="py-8 text-center text-gray-400 text-xs">
                                    Tidak ada pengguna yang cocok
                                </div>
                            ) : (
                                users.map((u) => {
                                    const isSelected = selectedUser?.id === u.id;
                                    return (
                                        <button
                                            key={u.id}
                                            type="button"
                                            onClick={() => handleSelectUser(u)}
                                            className={`w-full text-left p-3 rounded-xl border transition flex items-center justify-between gap-2 ${
                                                isSelected
                                                    ? 'bg-emerald-50/80 border-emerald-400 ring-1 ring-emerald-400'
                                                    : 'bg-white border-gray-200/80 hover:bg-slate-50'
                                            }`}
                                        >
                                            <div className="min-w-0 flex-1">
                                                <div className="font-bold text-xs text-gray-900 truncate">
                                                    {u.name}
                                                </div>
                                                <div className="text-[11px] text-gray-500 font-mono truncate">
                                                    {u.email}
                                                </div>
                                                <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                                                    {getRoleBadge(u.role)}
                                                    {u.is_pjs_active || u.pjs_role ? (
                                                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                                                            PJS SPI
                                                        </span>
                                                    ) : null}
                                                </div>
                                            </div>
                                            {isSelected && (
                                                <ArrowRight className="h-4 w-4 text-emerald-700 shrink-0" />
                                            )}
                                        </button>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column: User Details, PJS Card, and CRUD Matrix */}
                <div className="lg:col-span-8 space-y-6">
                    {selectedUser ? (
                        <>
                            {/* User Header Summary Card */}
                            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                <div className="flex items-center space-x-3.5">
                                    <div className="h-12 w-12 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold text-base shadow-sm">
                                        {selectedUser.name.charAt(0)}
                                    </div>
                                    <div>
                                        <div className="flex items-center space-x-2">
                                            <h3 className="text-base font-bold text-gray-900">{selectedUser.name}</h3>
                                            {getRoleBadge(selectedUser.role)}
                                        </div>
                                        <div className="flex items-center space-x-3 text-xs text-gray-500 mt-0.5">
                                            <span>{selectedUser.email}</span>
                                            <span>&bull;</span>
                                            <span className="flex items-center">
                                                <Building className="h-3 w-3 me-1 text-gray-400" />
                                                {selectedUser.department?.name || 'Unit Pusat PT BSP'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-xs text-right">
                                    <span className="text-gray-400">Total Izin Kustom:</span>{' '}
                                    <strong className="text-emerald-700 font-bold">
                                        {selectedUser.permissions?.length || 0} Aksi
                                    </strong>
                                </div>
                            </div>

                            {/* PJS Assignment Card */}
                            <PjsAssignmentCard user={selectedUser} />

                            {/* CRUD Permissions Matrix */}
                            <PermissionCrudMatrix user={selectedUser} allPermissions={permissions} />
                        </>
                    ) : (
                        <div className="bg-white rounded-2xl p-12 text-center text-gray-400 border border-gray-100">
                            <ShieldCheck className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                            <h4 className="text-base font-semibold text-gray-700">Pilih Pengguna</h4>
                            <p className="text-xs text-gray-500 mt-1">
                                Klik salah satu nama pengguna di sebelah kiri untuk mengonfigurasi hak akses atau menetapkan PJS.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

