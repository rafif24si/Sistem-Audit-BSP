import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import Pagination from '@/Components/Pagination';
import EmployeeModal from '@/Components/MasterData/EmployeeModal';
import { Plus, Search, Edit, Trash2, UserCheck, Users, Mail, Building } from 'lucide-react';

export default function Index({ employees, departments = [], filters }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [search, setSearch] = useState(filters.search || '');
    const [departmentFilter, setDepartmentFilter] = useState(filters.department_id || '');

    const handleFilterChange = (newFilters = {}) => {
        router.get(
            route('employees.index'),
            {
                search: newFilters.search !== undefined ? newFilters.search : search,
                department_id: newFilters.department_id !== undefined ? newFilters.department_id : departmentFilter,
            },
            { preserveState: true, replace: true }
        );
    };

    const handleDelete = (emp) => {
        if (confirm(`Yakin ingin menghapus pegawai '${emp.name}' dari master data?`)) {
            router.delete(route('employees.destroy', emp.id));
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 leading-tight">Master Pegawai PT BSP</h2>
                        <p className="text-xs text-gray-500 mt-0.5">Basis data referensi pegawai untuk integrasi undangan rapat dan persuratan</p>
                    </div>
                    <button
                        onClick={() => { setSelectedEmployee(null); setIsModalOpen(true); }}
                        className="inline-flex items-center rounded-lg bg-[#194f2b] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#123b20]"
                    >
                        <Plus className="me-1.5 h-4 w-4" />
                        Tambah Pegawai
                    </button>
                </div>
            }
        >
            <Head title="Master Pegawai - SPI PT BSP" />

            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="relative sm:col-span-2">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleFilterChange({ search })}
                            placeholder="Cari nama atau email pegawai..."
                            className="w-full pl-9 rounded-lg border-gray-300 text-sm focus:border-emerald-600 focus:ring-emerald-600"
                        />
                    </div>
                    <div>
                        <select
                            value={departmentFilter}
                            onChange={(e) => {
                                setDepartmentFilter(e.target.value);
                                handleFilterChange({ department_id: e.target.value });
                            }}
                            className="w-full rounded-lg border-gray-300 text-sm focus:border-emerald-600 focus:ring-emerald-600"
                        >
                            <option value="">Semua Departemen</option>
                            {departments.map((d) => (
                                <option key={d.id} value={d.id}>
                                    {d.code} - {d.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
                        <thead className="bg-slate-50 text-xs uppercase font-semibold text-gray-600">
                            <tr>
                                <th className="px-6 py-3.5 text-center w-28">Aksi</th>
                                <th className="px-6 py-3.5">Nama Pegawai</th>
                                <th className="px-6 py-3.5">Email Perusahaan</th>
                                <th className="px-6 py-3.5">Departemen</th>
                                <th className="px-6 py-3.5">Terdaftar</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 bg-white">
                            {employees.data.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="py-12 text-center text-gray-400">
                                        <Users className="mx-auto h-8 w-8 text-gray-300 mb-2" />
                                        Belum ada data pegawai tercatat
                                    </td>
                                </tr>
                            ) : (
                                employees.data.map((emp) => (
                                    <tr key={emp.id} className="hover:bg-slate-50/80 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <div className="inline-flex items-center space-x-1.5">
                                                <button
                                                    onClick={() => { setSelectedEmployee(emp); setIsModalOpen(true); }}
                                                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"
                                                    title="Ubah Pegawai"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(emp)}
                                                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
                                                    title="Hapus Pegawai"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="font-semibold text-gray-900">{emp.name}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-xs text-gray-600 font-mono flex items-center gap-1.5">
                                                <Mail className="h-3.5 w-3.5 text-gray-400" />
                                                <span>{emp.email}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {emp.department ? (
                                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
                                                    {emp.department.code} - {emp.department.name}
                                                </span>
                                            ) : (
                                                <span className="text-xs text-gray-400 italic">-</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                                            {new Date(emp.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                <Pagination links={employees.links} />
            </div>

            <EmployeeModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                employee={selectedEmployee}
                departments={departments}
            />
        </AuthenticatedLayout>
    );
}

