import { X, Award, CheckCircle2, AlertCircle, TrendingUp, BarChart3, PieChart } from 'lucide-react';

export default function KpiReportSummaryModal({ isOpen, onClose, kpis = [], periodYear = '' }) {
    if (!isOpen) return null;

    const totalKpis = kpis.length;
    const achievedKpis = kpis.filter((k) => k.status === 'Tercapai').length;
    const inProgressKpis = kpis.filter((k) => k.status === 'Dalam Proses').length;
    const needAttentionKpis = kpis.filter((k) => ['Perlu Perhatian', 'Belum Tercapai'].includes(k.status)).length;

    const avgAchievement = totalKpis > 0
        ? Math.round(kpis.reduce((acc, k) => acc + (Number(k.achievement_percentage) || 0), 0) / totalKpis)
        : 0;

    // Grouping by category
    const categoryStats = kpis.reduce((acc, k) => {
        const cat = k.category || 'Lainnya';
        if (!acc[cat]) {
            acc[cat] = { name: cat, total: 0, achieved: 0, totalPct: 0 };
        }
        acc[cat].total += 1;
        if (k.status === 'Tercapai') acc[cat].achieved += 1;
        acc[cat].totalPct += (Number(k.achievement_percentage) || 0);
        return acc;
    }, {});

    const categoriesArray = Object.values(categoryStats).map((c) => ({
        ...c,
        avgPct: Math.round(c.totalPct / c.total),
    }));

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
            <div className="relative w-full max-w-3xl rounded-2xl bg-white shadow-2xl my-8 overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-100 bg-[#194f2b] px-6 py-4 text-white">
                    <div className="flex items-center space-x-2.5">
                        <BarChart3 className="h-5 w-5 text-emerald-300" />
                        <div>
                            <h3 className="text-base font-bold">Ringkasan Laporan Capaian KPI</h3>
                            <p className="text-xs text-emerald-200">
                                Evaluasi Kinerja Pengawasan Intern SPI {periodYear ? `Tahun ${periodYear}` : ''}
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="rounded-lg p-1 text-emerald-200 hover:bg-white/10">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
                    {/* Top Overview Cards */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-center">
                            <span className="text-[11px] font-medium text-gray-500 uppercase">Total Indikator</span>
                            <p className="text-2xl font-black text-gray-900 mt-1">{totalKpis}</p>
                            <span className="text-[10px] text-gray-400">Target Kinerja</span>
                        </div>
                        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 text-center">
                            <span className="text-[11px] font-semibold text-emerald-800 uppercase">Rata-rata Capaian</span>
                            <p className="text-2xl font-black text-emerald-700 mt-1">{avgAchievement}%</p>
                            <span className="text-[10px] text-emerald-600">Seluruh KPI</span>
                        </div>
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3.5 text-center">
                            <span className="text-[11px] font-semibold text-blue-800 uppercase">Tercapai (100%)</span>
                            <p className="text-2xl font-black text-blue-700 mt-1">{achievedKpis}</p>
                            <span className="text-[10px] text-blue-600">Selesai/Memenuhi</span>
                        </div>
                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 text-center">
                            <span className="text-[11px] font-semibold text-amber-800 uppercase">Perlu Perhatian</span>
                            <p className="text-2xl font-black text-amber-700 mt-1">{needAttentionKpis + inProgressKpis}</p>
                            <span className="text-[10px] text-amber-600">Progres / Pending</span>
                        </div>
                    </div>

                    {/* Category Breakdown Table */}
                    <div>
                        <div className="flex items-center space-x-2 mb-3">
                            <PieChart className="w-4 h-4 text-[#194f2b]" />
                            <h4 className="text-sm font-bold text-gray-900">Distribusi Kinerja per Kategori</h4>
                        </div>
                        {categoriesArray.length === 0 ? (
                            <p className="text-xs text-gray-400 italic">Belum ada data indikator pada periode ini.</p>
                        ) : (
                            <div className="border border-gray-200 rounded-xl overflow-hidden shadow-2xs">
                                <table className="min-w-full divide-y divide-gray-200 text-left text-xs">
                                    <thead className="bg-slate-50 font-semibold text-gray-700 uppercase">
                                        <tr>
                                            <th className="px-4 py-2.5">Kategori KPI</th>
                                            <th className="px-4 py-2.5 text-center">Jumlah Target</th>
                                            <th className="px-4 py-2.5 text-center">Tercapai</th>
                                            <th className="px-4 py-2.5 text-right">Rata-rata Capaian</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 bg-white">
                                        {categoriesArray.map((cat) => (
                                            <tr key={cat.name} className="hover:bg-slate-50/60">
                                                <td className="px-4 py-3 font-semibold text-gray-800">{cat.name}</td>
                                                <td className="px-4 py-3 text-center text-gray-600">{cat.total}</td>
                                                <td className="px-4 py-3 text-center">
                                                    <span className="inline-flex items-center text-emerald-700 font-semibold">
                                                        <CheckCircle2 className="w-3.5 h-3.5 me-1" />
                                                        {cat.achieved} / {cat.total}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    <div className="inline-flex items-center space-x-2">
                                                        <div className="w-20 bg-gray-200 rounded-full h-1.5 overflow-hidden">
                                                            <div
                                                                className="bg-emerald-600 h-1.5 rounded-full"
                                                                style={{ width: `${Math.min(cat.avgPct, 100)}%` }}
                                                            />
                                                        </div>
                                                        <span className="font-bold text-gray-900 w-10 text-right">{cat.avgPct}%</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    {/* Detailed Indicators List */}
                    <div>
                        <h4 className="text-sm font-bold text-gray-900 mb-2">Daftar Status Indikator Kunci</h4>
                        <div className="divide-y divide-gray-100 border border-gray-100 rounded-xl overflow-hidden max-h-56 overflow-y-auto">
                            {kpis.map((kpi) => (
                                <div key={kpi.id} className="p-3 flex items-center justify-between hover:bg-slate-50 text-xs">
                                    <div className="min-w-0 pr-3">
                                        <p className="font-semibold text-gray-900 truncate">{kpi.title}</p>
                                        <p className="text-[11px] text-gray-400 mt-0.5">
                                            {kpi.category} • Target: {kpi.target_value} {kpi.unit} | Realisasi: {kpi.realization_value} {kpi.unit}
                                        </p>
                                    </div>
                                    <div className="flex items-center space-x-2 shrink-0">
                                        <span className="font-bold text-gray-700">{kpi.achievement_percentage}%</span>
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                                            kpi.status === 'Tercapai' ? 'bg-emerald-100 text-emerald-800' :
                                            kpi.status === 'Dalam Proses' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                                        }`}>
                                            {kpi.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Footer note */}
                    <div className="bg-emerald-50/60 border border-emerald-200/60 rounded-xl p-3 flex items-center space-x-2 text-xs text-emerald-900">
                        <Award className="w-4 h-4 text-emerald-700 shrink-0" />
                        <span>Data summary ini mencerminkan pencapaian pengawasan SPI yang sah dan terverifikasi berkas auditnya.</span>
                    </div>
                </div>

                <div className="flex justify-end p-4 border-t border-gray-100 bg-slate-50">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg bg-[#194f2b] px-5 py-2 text-xs font-semibold text-white hover:bg-[#123b20] transition shadow-xs"
                    >
                        Tutup Ringkasan
                    </button>
                </div>
            </div>
        </div>
    );
}

