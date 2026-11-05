import { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import { X, TrendingUp, UploadCloud, FileCheck, Download } from 'lucide-react';

export default function KpiProgressModal({ isOpen, onClose, kpi = null }) {
    if (!kpi || !isOpen) return null;

    const { data, setData, post, processing, errors, reset } = useForm({
        realization_value: kpi.realization_value ?? 0,
        status: kpi.status || 'Dalam Proses',
        notes: kpi.notes || '',
        evidence: null,
    });

    useEffect(() => {
        if (kpi) {
            setData({
                realization_value: kpi.realization_value ?? 0,
                status: kpi.status || 'Dalam Proses',
                notes: kpi.notes || '',
                evidence: null,
            });
        }
    }, [kpi, isOpen]);

    const submit = (e) => {
        e.preventDefault();
        post(route('kpis.update-progress', kpi.id), {
            forceFormData: true,
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
            <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl my-8 overflow-hidden">
                <div className="flex items-center justify-between border-b border-gray-100 bg-[#194f2b] px-6 py-4 text-white">
                    <div className="flex items-center space-x-2">
                        <TrendingUp className="h-5 w-5 text-emerald-300" />
                        <div>
                            <h3 className="text-base font-bold">Update Progres Capaian KPI</h3>
                            <p className="text-xs text-emerald-100">Catat realisasi terbaru dan unggah berkas bukti kinerja</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="rounded-lg p-1 text-emerald-200 hover:bg-white/10">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={submit} className="p-6 space-y-4 max-h-[85vh] overflow-y-auto">
                    <div className="rounded-xl bg-slate-50 border border-slate-200 p-3.5 space-y-1.5">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{kpi.category}</span>
                            <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                                {kpi.polarity === 'negative' ? 'Polaritas: Negatif (Makin Rendah Baik)' : 'Polaritas: Positif (Makin Tinggi Baik)'}
                            </span>
                        </div>
                        <h4 className="text-sm font-bold text-gray-900">{kpi.title}</h4>
                        <div className="flex items-center space-x-3 text-xs text-gray-600 pt-1">
                            <span>Target: <strong>{kpi.target_value} {kpi.unit}</strong></span>
                            <span>&bull;</span>
                            <span>Periode: <strong>{kpi.period}</strong></span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <InputLabel htmlFor="realization_value" value={`Realisasi Capaian Baru (${kpi.unit})`} />
                            <TextInput
                                id="realization_value"
                                type="number"
                                step="0.1"
                                min="0"
                                value={data.realization_value}
                                className="mt-1 block w-full text-base font-semibold text-gray-900"
                                onChange={(e) => setData('realization_value', e.target.value)}
                                required
                            />
                            <InputError message={errors.realization_value} className="mt-1" />
                        </div>
                        <div>
                            <InputLabel htmlFor="status" value="Status Ketercapaian" />
                            <select
                                id="status"
                                value={data.status}
                                onChange={(e) => setData('status', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-600 focus:ring-emerald-600 sm:text-sm"
                            >
                                <option value="Dalam Proses">Dalam Proses</option>
                                <option value="Tercapai">Tercapai</option>
                                <option value="Perlu Perhatian">Perlu Perhatian</option>
                                <option value="Belum Tercapai">Belum Tercapai</option>
                            </select>
                            <InputError message={errors.status} className="mt-1" />
                        </div>
                    </div>

                    <div>
                        <InputLabel htmlFor="notes" value="Catatan Progres / Keterangan Pencapaian" />
                        <textarea
                            id="notes"
                            rows={3}
                            value={data.notes}
                            placeholder="Tuliskan evaluasi capaian, kendala lapangan, atau justifikasi hasil..."
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-600 focus:ring-emerald-600 sm:text-sm"
                            onChange={(e) => setData('notes', e.target.value)}
                        />
                        <InputError message={errors.notes} className="mt-1" />
                    </div>

                    <div>
                        <InputLabel htmlFor="evidence" value="Unggah Dokumen Bukti Kinerja (Evidence)" />
                        <p className="text-[11px] text-gray-400 mb-1.5">Format: PDF, Word, Excel, atau Foto hasil uji (Maks. 10MB)</p>
                        <input
                            id="evidence"
                            type="file"
                            accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.png"
                            onChange={(e) => setData('evidence', e.target.files[0])}
                            className="mt-1 block w-full text-xs text-slate-500 file:me-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                        />
                        <InputError message={errors.evidence} className="mt-1" />

                        {kpi.evidence_path && (
                            <div className="mt-2 flex items-center justify-between p-2 rounded-lg bg-emerald-50/70 border border-emerald-200 text-xs">
                                <span className="flex items-center text-emerald-800">
                                    <FileCheck className="h-4 w-4 me-1.5 text-emerald-600" />
                                    Bukti capaian sebelumnya tersimpan
                                </span>
                                <a
                                    href={route('kpis.evidence', kpi.id)}
                                    className="inline-flex items-center text-xs font-semibold text-emerald-700 hover:text-emerald-900 underline"
                                >
                                    <Download className="h-3.5 w-3.5 me-1" /> Unduh
                                </a>
                            </div>
                        )}
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
                            className="inline-flex items-center rounded-lg bg-[#194f2b] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#123b20] disabled:opacity-75 transition"
                        >
                            <UploadCloud className="h-4 w-4 me-1.5" />
                            {processing ? 'Menyimpan...' : 'Simpan Progres Capaian'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

