import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import Pagination from '@/Components/Pagination';
import KpiPeriodModal from '@/Components/MasterData/KpiPeriodModal';
import { Plus, Search, Edit, Trash2, CalendarRange, CheckCircle2, XCircle } from 'lucide-react';

export default function Index({ kpiPeriods, filters }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPeriod, setSelectedPeriod] = useState(null);
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (e) => {
        if (e.key === 'Enter') {
            router.get(
                route('kpi-periods.index'),
                { search },
                { preserveState: true, replace: true }
            );
        }
    };

    const handleDelete = (period) => {
        if (confirm(`Yakin ingin menghapus master periode KPI tahun '${period.year}'?`)) {
            router.delete(route('kpi-periods.destroy', period.id));
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 leading-tight">Master Periode KPI</h2>
                        <p className="text-xs text-gray-500 mt-0.5">Kelola daftar tahun kalender evaluasi capaian Key Performance Indicators</p>
                    </div>
                    <button
                        onClick={() => { setSelectedPeriod(null); setIsModalOpen(true); }}
                        className="inline-flex items-center rounded-lg bg-[#194f2b] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#123b20]"
                    >
                        <Plus className="me-1.5 h-4 w-4" />
                        Tambah Periode
                    </button>
                </div>
            }
        >
            <Head title="Master Periode KPI - SPI PT BSP" />

            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={handleSearch}
                        placeholder="Cari tahun periode (contoh: 2026)..."
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
                                <th className="px-6 py-3.5">Tahun Periode KPI</th>
                                <th className="px-6 py-3.5 text-center">Jumlah Indikator</th>
                                <th className="px-6 py-3.5 text-center w-36">Status</th>
                                <th className="px-6 py-3.5">Terdaftar</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 bg-white">
                            {kpiPeriods.data.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="py-12 text-center text-gray-400">
                                        <CalendarRange className="mx-auto h-8 w-8 text-gray-300 mb-2" />
                                        Belum ada periode KPI tercatat
                                    </td>
                                </tr>
                            ) : (
                                kpiPeriods.data.map((period) => (
                                    <tr key={period.id} className="hover:bg-slate-50/80 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <div className="inline-flex items-center space-x-1.5">
                                                <button
                                                    onClick={() => { setSelectedPeriod(period); setIsModalOpen(true); }}
                                                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"
                                                    title="Ubah Periode"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(period)}
                                                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
                                                    title="Hapus Periode"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="font-semibold text-gray-900 flex items-center space-x-2">
                                                <CalendarRange className="h-4 w-4 text-emerald-600" />
                                                <span>Tahun {period.year}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700">
                                                {period.kpis_count ?? 0} Indikator
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            {period.is_active ? (
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                                                    <CheckCircle2 className="h-3.5 w-3.5 me-1 text-emerald-600" />
                                                    Tahun Aktif
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">
                                                    <XCircle className="h-3.5 w-3.5 me-1 text-gray-500" />
                                                    Arsip
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                                            {new Date(period.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                <Pagination links={kpiPeriods.links} />
            </div>

            <KpiPeriodModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                kpiPeriod={selectedPeriod}
            />
        </AuthenticatedLayout>
    );
}

