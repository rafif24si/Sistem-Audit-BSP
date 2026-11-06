import { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import { X, CalendarRange } from 'lucide-react';

export default function KpiPeriodModal({ isOpen, onClose, kpiPeriod = null }) {
    const isEdit = !!kpiPeriod;

    const { data, setData, post, put, processing, errors, reset } = useForm({
        year: '',
        is_active: true,
    });

    useEffect(() => {
        if (kpiPeriod) {
            setData({
                year: kpiPeriod.year || '',
                is_active: kpiPeriod.is_active ?? true,
            });
        } else {
            reset();
            setData({
                year: '',
                is_active: true,
            });
        }
    }, [kpiPeriod, isOpen]);

    if (!isOpen) return null;

    const submit = (e) => {
        e.preventDefault();
        if (isEdit) {
            put(route('kpi-periods.update', kpiPeriod.id), {
                onSuccess: () => {
                    reset();
                    onClose();
                },
            });
        } else {
            post(route('kpi-periods.store'), {
                onSuccess: () => {
                    reset();
                    onClose();
                },
            });
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
            <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl my-8 overflow-hidden">
                <div className="flex items-center justify-between border-b border-gray-100 bg-[#194f2b] px-6 py-4 text-white">
                    <div className="flex items-center space-x-2">
                        <CalendarRange className="h-5 w-5 text-emerald-300" />
                        <h3 className="text-base font-bold">
                            {isEdit ? 'Ubah Periode KPI' : 'Tambah Periode KPI Baru'}
                        </h3>
                    </div>
                    <button onClick={onClose} className="rounded-lg p-1 text-emerald-200 hover:bg-white/10">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={submit} className="p-6 space-y-4">
                    <div>
                        <InputLabel htmlFor="year" value="Tahun Periode KPI" />
                        <TextInput
                            id="year"
                            type="number"
                            min="2020"
                            max="2099"
                            value={data.year}
                            placeholder="Contoh: 2026"
                            className="mt-1 block w-full"
                            onChange={(e) => setData('year', e.target.value)}
                            required
                        />
                        <p className="text-[11px] text-gray-500 mt-1">Masukkan 4 digit tahun kalender evaluasi kinerja.</p>
                        <InputError message={errors.year} className="mt-1" />
                    </div>

                    <div className="pt-2">
                        <label className="flex items-center space-x-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={data.is_active}
                                onChange={(e) => setData('is_active', e.target.checked)}
                                className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                            />
                            <div>
                                <span className="text-sm font-semibold text-gray-800">Periode Aktif (Tahun Berjalan)</span>
                                <p className="text-xs text-gray-500">
                                    Periode yang aktif akan menjadi acuan filter default pada dashboard capaian KPI.
                                </p>
                            </div>
                        </label>
                        <InputError message={errors.is_active} className="mt-1" />
                    </div>

                    <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center rounded-lg bg-[#194f2b] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#123b20] disabled:opacity-50"
                        >
                            {processing ? 'Menyimpan...' : isEdit ? 'Simpan Perubahan' : 'Tambah Periode'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

