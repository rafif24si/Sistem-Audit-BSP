import { useState } from 'react';
import { router } from '@inertiajs/react';
import KpiModal from '@/Components/Dashboard/KpiModal';
import { Target, Plus, Edit2, Trash2, Award, TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function KpiSection({ kpis = [], canManage = false }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedKpi, setSelectedKpi] = useState(null);

    const handleCreate = () => {
        setSelectedKpi(null);
        setIsModalOpen(true);
    };

    const handleEdit = (kpi) => {
        setSelectedKpi(kpi);
        setIsModalOpen(true);
    };

    const handleDelete = (kpi) => {
        if (confirm(`Yakin ingin menghapus indikator kinerja '${kpi.title}'?`)) {
            router.delete(route('kpis.destroy', kpi.id));
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'Tercapai':
                return {
                    bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                    icon: CheckCircle2,
                    bar: 'bg-emerald-600',
                };
            case 'Dalam Proses':
                return {
                    bg: 'bg-blue-50 text-blue-700 border-blue-200',
                    icon: TrendingUp,
                    bar: 'bg-blue-600',
                };
            case 'Perlu Perhatian':
                return {
                    bg: 'bg-amber-50 text-amber-700 border-amber-200',
                    icon: AlertCircle,
                    bar: 'bg-amber-500',
                };
            default:
                return {
                    bg: 'bg-rose-50 text-rose-700 border-rose-200',
                    icon: AlertCircle,
                    bar: 'bg-rose-500',
                };
        }
    };

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-5 border-b border-gray-100 gap-3">
                <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                        <Target className="h-5 w-5" />
                    </div>
                    <div>
                        <h3 className="text-base font-bold text-gray-900 leading-tight">
                            Indikator Kinerja Kunci (KPI) Satuan Pengawasan Intern
                        </h3>
                        <p className="text-xs text-gray-500 mt-0.5">
                            Pencatatan target & realisasi capaian pengawasan audit tahunan secara fleksibel
                        </p>
                    </div>
                </div>

                {canManage && (
                    <button
                        onClick={handleCreate}
                        className="inline-flex items-center self-start sm:self-auto rounded-lg bg-[#194f2b] px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#123b20] transition"
                    >
                        <Plus className="h-3.5 w-3.5 me-1.5" />
                        Tambah Target KPI
                    </button>
                )}
            </div>

            {kpis.length === 0 ? (
                <div className="py-10 text-center text-gray-400">
                    <Award className="mx-auto h-8 w-8 text-gray-300 mb-2" />
                    <p className="text-sm font-medium">Belum ada indikator kinerja (KPI) yang tercatat.</p>
                    {canManage && (
                        <p className="text-xs text-gray-400 mt-1">
                            Klik tombol "Tambah Target KPI" di atas untuk menambahkan indikator baru.
                        </p>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
                    {kpis.map((kpi) => {
                        const style = getStatusBadge(kpi.status);
                        const StatusIcon = style.icon;
                        const pct = Math.min(Math.max(kpi.achievement_percentage || 0, 0), 100);

                        return (
                            <div
                                key={kpi.id}
                                className="relative rounded-xl border border-gray-150 bg-slate-50/60 p-4 hover:shadow-sm hover:border-gray-300 transition duration-150 flex flex-col justify-between"
                            >
                                <div>
                                    <div className="flex items-center justify-between gap-2 mb-2">
                                        <div className="flex items-center space-x-2">
                                            <span className="text-[10px] font-bold text-gray-500 bg-white border border-gray-200 px-2 py-0.5 rounded-md">
                                                {kpi.category}
                                            </span>
                                            <span className="text-[10px] text-gray-400 font-medium">
                                                {kpi.period}
                                            </span>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold border ${style.bg}`}>
                                                <StatusIcon className="h-3 w-3 me-1" />
                                                {kpi.status}
                                            </span>
                                            {canManage && (
                                                <div className="flex items-center ms-1">
                                                    <button
                                                        onClick={() => handleEdit(kpi)}
                                                        className="p-1 text-gray-400 hover:text-blue-600 rounded hover:bg-white"
                                                        title="Ubah / Sesuaikan KPI"
                                                    >
                                                        <Edit2 className="h-3.5 w-3.5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(kpi)}
                                                        className="p-1 text-gray-400 hover:text-red-600 rounded hover:bg-white"
                                                        title="Hapus KPI"
                                                    >
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <h4 className="text-sm font-bold text-gray-900 leading-snug">
                                        {kpi.title}
                                    </h4>

                                    {kpi.notes && (
                                        <p className="text-[11px] text-gray-500 mt-1.5 italic line-clamp-2">
                                            "{kpi.notes}"
                                        </p>
                                    )}
                                </div>

                                <div className="mt-4 pt-3 border-t border-gray-200/60">
                                    <div className="flex items-center justify-between text-xs mb-1.5">
                                        <span className="text-gray-500">
                                            Realisasi: <strong className="text-gray-900">{kpi.realization_value} {kpi.unit}</strong>
                                        </span>
                                        <span className="text-gray-500">
                                            Target: <strong className="text-gray-800">{kpi.target_value} {kpi.unit}</strong> ({kpi.achievement_percentage}%)
                                        </span>
                                    </div>
                                    <div className="h-2 w-full rounded-full bg-gray-200 overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all duration-500 ${style.bar}`}
                                            style={{ width: `${pct}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            <KpiModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                kpi={selectedKpi}
            />
        </div>
    );
}
