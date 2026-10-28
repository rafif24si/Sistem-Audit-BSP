import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react';
import Pagination from '@/Components/Pagination';
import UserModal from '@/Components/Users/UserModal';
import { Plus, Search, Edit, Trash2, Users, ShieldCheck, Briefcase } from 'lucide-react';

export default function Index({ users, departments, filters }) {
    const currentUser = usePage().props.auth.user;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [search, setSearch] = useState(filters.search || '');
    const [roleFilter, setRoleFilter] = useState(filters.role || '');
    const [deptFilter, setDeptFilter] = useState(filters.department_id || '');

    const handleFilterChange = (newFilters = {}) => {
        router.get(
            route('users.index'),
            {
                search: newFilters.search !== undefined ? newFilters.search : search,
                role: newFilters.role !== undefined ? newFilters.role : roleFilter,
                department_id: newFilters.department_id !== undefined ? newFilters.department_id : deptFilter,
            },
            { preserveState: true, replace: true }
        );
    };

    const handleDelete = (targetUser) => {
        if (targetUser.id === currentUser.id) {
            alert('Anda tidak dapat menghapus akun Anda sendiri.');
            return;
        }
        if (confirm(`Yakin ingin menonaktifkan pengguna ${targetUser.name}?`)) {
            router.delete(route('users.destroy', targetUser.id));
        }
    };

    const getRoleBadge = (role) => {
        switch (role) {
            case 'super_admin':
                return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-purple-100 text-purple-800">Super Admin</span>;
            case 'manager_spi':
                return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-blue-100 text-blue-800">Manager SPI</span>;
            case 'auditor':
                return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-emerald-100 text-emerald-800">Auditor SPI</span>;
            case 'auditee':
                return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-amber-100 text-amber-800">Auditee (PIC)</span>;
            default:
                return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-gray-100 text-gray-800">{role}</span>;
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 leading-tight">Kelola Pengguna Sistem</h2>
                        <p className="text-xs text-gray-500 mt-0.5">Otoritas Super Admin: Manajemen akun, penugasan peran, dan unit kerja PT BSP</p>
                    </div>
                    <button
                        onClick={() => { setSelectedUser(null); setIsModalOpen(true); }}
                        className="inline-flex items-center rounded-lg bg-[#194f2b] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#123b20]"
                    >
                        <Plus className="me-1.5 h-4 w-4" />
                        Tambah Pengguna
                    </button>
                </div>
            }
        >
            <Head title="Kelola Pengguna - SPI PT BSP" />

            {/* Filter Bar */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <div className="relative sm:col-span-2">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleFilterChange({ search })}
                            placeholder="Cari nama atau email pengguna..."
                            className="w-full pl-9 rounded-lg border-gray-300 text-sm focus:border-emerald-600 focus:ring-emerald-600"
                        />
                    </div>
                    <div>
                        <select
                            value={roleFilter}
                            onChange={(e) => { setRoleFilter(e.target.value); handleFilterChange({ role: e.target.value }); }}
                            className="w-full rounded-lg border-gray-300 text-sm focus:border-emerald-600 focus:ring-emerald-600"
                        >
                            <option value="">Semua Peran (Role)</option>
                            <option value="super_admin">Super Admin</option>
                            <option value="manager_spi">Manager SPI</option>
                            <option value="auditor">Auditor</option>
                            <option value="auditee">Auditee</option>
                        </select>
                    </div>
                    <div>
                        <select
                            value={deptFilter}
                            onChange={(e) => { setDeptFilter(e.target.value); handleFilterChange({ department_id: e.target.value }); }}
                            className="w-full rounded-lg border-gray-300 text-sm focus:border-emerald-600 focus:ring-emerald-600"
                        >
                            <option value="">Semua Departemen</option>
                            {departments.map((d) => (
                                <option key={d.id} value={d.id}>{d.code} - {d.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
                        <thead className="bg-slate-50 text-xs uppercase font-semibold text-gray-600">
                            <tr>
                                <th className="px-6 py-3.5">Nama & Email</th>
                                <th className="px-6 py-3.5">Peran (Role)</th>
                                <th className="px-6 py-3.5">Unit Kerja / Departemen</th>
                                <th className="px-6 py-3.5">Terdaftar</th>
                                <th className="px-6 py-3.5 text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 bg-white">
                            {users.data.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="py-12 text-center text-gray-400">
                                        <Users className="mx-auto h-8 w-8 text-gray-300 mb-2" />
                                        Belum ada pengguna yang sesuai pencarian
                                    </td>
                                </tr>
                            ) : (
                                users.data.map((u) => (
                                    <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="font-semibold text-gray-900">{u.name}</div>
                                            <div className="text-xs text-gray-500 font-mono mt-0.5">{u.email}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {getRoleBadge(u.role)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {u.department ? (
                                                <span className="font-medium text-gray-700">
                                                    {u.department.code} - <span className="text-xs text-gray-500">{u.department.name}</span>
                                                </span>
                                            ) : (
                                                <span className="text-xs text-gray-400 italic">Pusat / Semua</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                                            {new Date(u.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <div className="inline-flex items-center space-x-2">
                                                <button
                                                    onClick={() => { setSelectedUser(u); setIsModalOpen(true); }}
                                                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"
                                                    title="Ubah Pengguna"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </button>
                                                {u.id !== currentUser.id && (
                                                    <button
                                                        onClick={() => handleDelete(u)}
                                                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
                                                        title="Hapus Pengguna"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                <Pagination links={users.links} />
            </div>

            <UserModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                user={selectedUser}
                departments={departments}
            />
        </AuthenticatedLayout>
    );
}
