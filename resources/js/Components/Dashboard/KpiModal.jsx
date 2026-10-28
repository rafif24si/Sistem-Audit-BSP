import { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import { X, Target } from 'lucide-react';

export default function KpiModal({ isOpen, onClose, kpi = null }) {
    const isEdit = !!kpi;

    const { data, setData, post, put, processing, errors, reset } = useForm({
        title: '',
        category: 'Operasional Audit',
        target_value: 100,
        realization_value: 0,
        unit: '%',
        period: 'Tahun 2026',
        status: 'Dalam Proses',
        notes: '',
        order_index: 0,
    });

    useEffect(() => {
        if (kpi) {
            setData({
                title: kpi.title || '',
                category: kpi.category || 'Operasional Audit',
                target_value: kpi.target_value ?? 100,
                realization_value: kpi.realization_value ?? 0,
                unit: kpi.unit || '%',
                period: kpi.period || 'Tahun 2026',
                status: kpi.status || 'Dalam Proses',
                notes: kpi.notes || '',
                order_index: kpi.order_index ?? 0,
            });
        } else {
            reset();
        }
    }, [kpi, isOpen]);

    if (!isOpen) return null;

    const submit = (e) => {
        e.preventDefault();
        const action = isEdit ? put(route('kpis.update', kpi.id)) : post(route('kpis.store'));
        action.then?.() || action;
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        if (isEdit) {
            put(route('kpis.update', kpi.id), {
                onSuccess: () => {
                    reset();
                    onClose();
                },
            });
        } else {
            post(route('kpis.store'), {
                onSuccess: () => {
                    reset();
                    onClose();
                },
            });
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
            <div className="relative w-full max-w-xl rounded-2xl bg-white shadow-2xl my-8 overflow-hidden">
                <div className="flex items-center justify-between border-b border-gray-100 bg-[#194f2b] px-6 py-4 text-white">
                    <div className="flex items-center space-x-2">
                        <Target className="h-5 w-5 text-emerald-300" />
                        <h3 className="text-base font-bold">
                            {isEdit ? 'Sesuaikan Indikator Kinerja (KPI)' : 'Tambah Target KPI Baru'}
                        </h3>
                    </div>
                    <button onClick={onClose} className="rounded-lg p-1 text-emerald-200 hover:bg-white/10">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleFormSubmit} className="p-6 space-y-4 max-h-[85vh] overflow-y-auto">
                    <div>
                        <InputLabel htmlFor="title" value="Nama Indikator Kinerja (KPI)" />
                        <TextInput
                            id="title"
                            value={data.title}
                            placeholder="Contoh: Penyelesaian Program Kerja Pengawasan Tahunan (PKPT)"
                            className="mt-1 block w-full"
                            onChange={(e) => setData('title', e.target.value)}
                            required
                        />
                        <InputError message={errors.title} className="mt-1" />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <InputLabel htmlFor="category" value="Kategori KPI" />
                            <select
                                id="category"
                                value={data.category}
                                onChange={(e) => setData('category', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-600 focus:ring-emerald-600 sm:text-sm"
                            >
                                <option value="Operasional Audit">Operasional Audit</option>
                                <option value="Kepatuhan & Tata Kelola">Kepatuhan & Tata Kelola</option>
                                <option value="Administrasi & Pelaporan">Administrasi & Pelaporan</option>
                                <option value="Pengembangan SDM">Pengembangan SDM</option>
                            </select>
                            <InputError message={errors.category} className="mt-1" />
                        </div>
                        <div>
                            <InputLabel htmlFor="period" value="Periode Capaian" />
                            <TextInput
                                id="period"
                                value={data.period}
                                placeholder="Contoh: Tahun 2026 atau Triwulan III 2026"
                                className="mt-1 block w-full"
                                onChange={(e) => setData('period', e.target.value)}
                                required
                            />
                            <InputError message={errors.period} className="mt-1" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                            <InputLabel htmlFor="target_value" value="Nilai Target" />
                            <TextInput
                                id="target_value"
                                type="number"
                                step="0.1"
                                min="0"
                                value={data.target_value}
                                className="mt-1 block w-full"
                                onChange={(e) => setData('target_value', e.target.value)}
                                required
                            />
                            <InputError message={errors.target_value} className="mt-1" />
                        </div>
                        <div>
                            <InputLabel htmlFor="realization_value" value="Realisasi Saat Ini" />
                            <TextInput
                                id="realization_value"
                                type="number"
                                step="0.1"
                                min="0"
                                value={data.realization_value}
                                className="mt-1 block w-full"
                                onChange={(e) => setData('realization_value', e.target.value)}
                                required
                            />
                            <InputError message={errors.realization_value} className="mt-1" />
                        </div>
                        <div>
                            <InputLabel htmlFor="unit" value="Satuan Ukur" />
                            <TextInput
                                id="unit"
                                value={data.unit}
                                placeholder="%, Hari, Dokumen"
                                className="mt-1 block w-full"
                                onChange={(e) => setData('unit', e.target.value)}
                                required
                            />
                            <InputError message={errors.unit} className="mt-1" />
                        </div>
                    </div>

                    <div>
                        <InputLabel htmlFor="status" value="Status Ketercapaian" />
                        <select
                            id="status"
                            value={data.status}
                            onChange={(e) => setData('status', e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-600 focus:ring-emerald-600 sm:text-sm"
                        >
                            <option value="Dalam Proses">Dalam Proses (Sedang Berjalan)</option>
                            <option value="Tercapai">Tercapai (Memenuhi / Melampaui Target)</option>
                            <option value="Perlu Perhatian">Perlu Perhatian (Berisiko Terlambat)</option>
                            <option value="Belum Tercapai">Belum Tercapai</option>
                        </select>
                        <InputError message={errors.status} className="mt-1" />
                    </div>

                    <div>
                        <InputLabel htmlFor="notes" value="Catatan Evaluasi / Keterangan Capaian" />
                        <textarea
                            id="notes"
                            rows={3}
                            value={data.notes}
                            placeholder="Catatan analisis tindak lanjut, kendala, atau rincian capaian..."
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-600 focus:ring-emerald-600 sm:text-sm"
                            onChange={(e) => setData('notes', e.target.value)}
                        />
                        <InputError message={errors.notes} className="mt-1" />
                    </div>

                    <div className="flex items-center justify-end space-x-3 pt-3 border-t border-gray-100">
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
                            className="rounded-lg bg-[#194f2b] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#123b20] disabled:opacity-75"
                        >
                            {processing ? 'Menyimpan...' : (isEdit ? 'Perbarui KPI' : 'Simpan KPI')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
