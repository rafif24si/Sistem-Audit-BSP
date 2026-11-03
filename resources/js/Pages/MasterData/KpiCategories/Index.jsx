import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import Pagination from '@/Components/Pagination';
import KpiCategoryModal from '@/Components/MasterData/KpiCategoryModal';
import { Plus, Search, Edit, Trash2, Target } from 'lucide-react';

export default function Index({ kpiCategories, filters }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (e) => {
        if (e.key === 'Enter') {
            router.get(
                route('kpi-categories.index'),
                { search },
                { preserveState: true, replace: true }
            );
        }
    };

    const handleDelete = (kc) => {
        if (confirm(`Yakin ingin menghapus kategori KPI '${kc.name}'?`)) {
            router.delete(route('kpi-categories.destroy', kc.id));
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 leading-tight">Master Kategori KPI</h2>
                        <p className="text-xs text-gray-500 mt-0.5">Kelola kategori indikator kinerja utama (KPI) SPI PT BSP</p>
                    </div>
                    <button
                        onClick={() => { setSelectedCategory(null); setIsModalOpen(true); }}
                        className="inline-flex items-center rounded-lg bg-[#194f2b] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#123b20]"
                    >
                        <Plus className="me-1.5 h-4 w-4" />
                        Tambah Kategori KPI
                    </button>
                </div>
            }
        >
            <Head title="Master Kategori KPI - SPI PT BSP" />

            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={handleSearch}
                        placeholder="Cari kategori KPI atau deskripsi..."
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
                                <th className="px-6 py-3.5">Nama Kategori KPI</th>
                                <th className="px-6 py-3.5">Keterangan / Deskripsi</th>
                                <th className="px-6 py-3.5">Terdaftar</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 bg-white">
                            {kpiCategories.data.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="py-12 text-center text-gray-400">
                                        <Target className="mx-auto h-8 w-8 text-gray-300 mb-2" />
                                        Belum ada data kategori KPI tercatat
                                    </td>
                                </tr>
                            ) : (
                                kpiCategories.data.map((kc) => (
                                    <tr key={kc.id} className="hover:bg-slate-50/80 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <div className="inline-flex items-center space-x-1.5">
                                                <button
                                                    onClick={() => { setSelectedCategory(kc); setIsModalOpen(true); }}
                                                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"
                                                    title="Ubah Kategori KPI"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(kc)}
                                                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
                                                    title="Hapus Kategori KPI"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-bold text-gray-900 whitespace-nowrap">
                                            {kc.name}
                                        </td>
                                        <td className="px-6 py-4 text-xs text-gray-600 max-w-md">
                                            {kc.description || <span className="text-gray-400 italic">Tidak ada keterangan</span>}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                                            {new Date(kc.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                <Pagination links={kpiCategories.links} />
            </div>

            <KpiCategoryModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                kpiCategory={selectedCategory}
            />
        </AuthenticatedLayout>
    );
}

