import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import Pagination from '@/Components/Pagination';
import DepartmentModal from '@/Components/MasterData/DepartmentModal';
import { Plus, Search, Edit, Trash2, Building2, Users, FileText } from 'lucide-react';

export default function Index({ departments, filters }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDept, setSelectedDept] = useState(null);
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (e) => {
        if (e.key === 'Enter') {
            router.get(
                route('departments.index'),
                { search },
                { preserveState: true, replace: true }
            );
        }
    };

    const handleDelete = (dept) => {
        if (confirm(`Yakin ingin menghapus master departemen ${dept.name} (${dept.code})?`)) {
            router.delete(route('departments.destroy', dept.id));
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 leading-tight">Master Departemen / Unit Kerja</h2>
                        <p className="text-xs text-gray-500 mt-0.5">Kelola data induk departemen PT Bumi Siak Pusako untuk pemilik SOP dan surat</p>
                    </div>
                    <button
                        onClick={() => { setSelectedDept(null); setIsModalOpen(true); }}
                        className="inline-flex items-center rounded-lg bg-[#194f2b] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#123b20]"
                    >
                        <Plus className="me-1.5 h-4 w-4" />
                        Tambah Departemen
                    </button>
                </div>
            }
        >
            <Head title="Master Departemen - SPI PT BSP" />

            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={handleSearch}
                        placeholder="Cari kode atau nama departemen..."
                        className="w-full pl-9 rounded-lg border-gray-300 text-sm focus:border-emerald-600 focus:ring-emerald-600"
                    />
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
                        <thead className="bg-slate-50 text-xs uppercase font-semibold text-gray-600">
                            <tr>
                                <th className="px-6 py-3.5 text-center w-28">Aksi</th>
                                <th className="px-6 py-3.5">Kode</th>
                                <th className="px-6 py-3.5">Nama Departemen</th>
                                <th className="px-6 py-3.5 text-center">Total Pengguna</th>
                                <th className="px-6 py-3.5 text-center">Dokumen SOP</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 bg-white">
                            {departments.data.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="py-12 text-center text-gray-400">
                                        <Building2 className="mx-auto h-8 w-8 text-gray-300 mb-2" />
                                        Belum ada data departemen tercatat
                                    </td>
                                </tr>
                            ) : (
                                departments.data.map((d) => (
                                    <tr key={d.id} className="hover:bg-slate-50/80 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <div className="inline-flex items-center space-x-1.5">
                                                <button
                                                    onClick={() => { setSelectedDept(d); setIsModalOpen(true); }}
                                                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"
                                                    title="Ubah Departemen"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(d)}
                                                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
                                                    title="Hapus Departemen"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap font-mono font-bold text-emerald-950">
                                            {d.code}
                                        </td>
                                        <td className="px-6 py-4 font-semibold text-gray-900">
                                            {d.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <span className="inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                                                <Users className="w-3 h-3 me-1 text-slate-500" />
                                                {d.users_count ?? 0}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <span className="inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                                                <FileText className="w-3 h-3 me-1 text-emerald-600" />
                                                {d.master_documents_count ?? 0}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                <Pagination links={departments.links} />
            </div>

            <DepartmentModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                department={selectedDept}
            />
        </AuthenticatedLayout>
    );
}

