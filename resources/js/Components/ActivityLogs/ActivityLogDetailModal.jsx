import { X, ArrowRightLeft } from 'lucide-react';
import { getFriendlyFieldLabel, formatFriendlyValue } from './logDictionary';

export default function ActivityLogDetailModal({ isOpen, onClose, log = null }) {
    if (!isOpen || !log) return null;

    const oldVals = log.old_values || {};
    const newVals = log.new_values || {};
    const allKeys = Array.from(new Set([...Object.keys(oldVals), ...Object.keys(newVals)]));

    const renderValue = (val, isOld = false, key = '') => {
        const formatted = formatFriendlyValue(val, key);
        if (formatted === null) {
            return (
                <span className="text-gray-400 italic text-[11px]">
                    {isOld ? 'Tidak ada nilai sebelumnya' : 'Dikosongkan / Tidak ada nilai'}
                </span>
            );
        }
        if (typeof val === 'object' && !Array.isArray(val)) {
            return <pre className="whitespace-pre-wrap font-mono text-[11px] bg-slate-50 p-2 rounded">{formatted}</pre>;
        }
        return <span className="text-xs font-medium">{formatted}</span>;
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
            <div className="relative w-full max-w-3xl rounded-2xl bg-white shadow-2xl my-8 overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-100 bg-[#194f2b] px-6 py-4 text-white">
                    <div className="flex items-center space-x-2.5">
                        <ArrowRightLeft className="h-5 w-5 text-emerald-300" />
                        <div>
                            <h3 className="text-base font-bold">Rincian Perubahan Data (Audit Trail)</h3>
                            <p className="text-xs text-emerald-200">
                                {log.action_label || log.action} • {log.user?.name || 'Sistem'}
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="rounded-lg p-1 text-emerald-200 hover:bg-white/10">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
                    {/* Metadata Card */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs">
                        <div>
                            <span className="text-gray-500 font-medium">Aktivitas:</span>
                            <p className="font-semibold text-emerald-950 mt-0.5">{log.action_label || log.action}</p>
                            <span className="font-mono text-[10px] text-gray-400 font-semibold">{log.action}</span>
                        </div>
                        <div>
                            <span className="text-gray-500 font-medium">Pelaksana & IP:</span>
                            <p className="font-semibold text-gray-900 mt-0.5">{log.user?.name || 'Sistem'} ({log.user?.role || '-'})</p>
                            <span className="font-mono text-[10px] text-gray-400">IP: {log.ip_address || '-'}</span>
                        </div>
                        <div className="sm:col-span-2 pt-2 border-t border-slate-200/60">
                            <span className="text-gray-500 font-medium">Deskripsi Mutasi:</span>
                            <p className="text-gray-800 mt-0.5">{log.description}</p>
                        </div>
                    </div>

                    {/* Side-by-Side Diff Table */}
                    <div>
                        <h4 className="font-bold text-gray-900 mb-2.5 text-xs uppercase tracking-wider text-gray-500">
                            Perbandingan Data Sebelum & Sesudah Pembaruan
                        </h4>
                        {allKeys.length === 0 ? (
                            <div className="p-6 text-center text-xs text-gray-400 bg-slate-50 border border-slate-200 rounded-xl">
                                Tidak ada rincian data sebelum dan sesudah untuk aksi ini (misal login/logout).
                            </div>
                        ) : (
                            <div className="border border-gray-200 rounded-xl overflow-hidden shadow-2xs">
                                <table className="min-w-full divide-y divide-gray-200 text-left">
                                    <thead className="bg-slate-100 text-[11px] font-bold uppercase text-gray-700">
                                        <tr>
                                            <th className="px-4 py-2.5 w-1/3">Kolom / Data yang Diubah</th>
                                            <th className="px-4 py-2.5 w-1/3 bg-rose-50 text-rose-900 border-l border-rose-100">
                                                Nilai Sebelumnya (Lama)
                                            </th>
                                            <th className="px-4 py-2.5 w-1/3 bg-emerald-50 text-emerald-900 border-l border-emerald-100">
                                                Nilai Pembaruan (Baru)
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 bg-white">
                                        {allKeys.map((key) => {
                                            const oldVal = oldVals[key];
                                            const newVal = newVals[key];
                                            const isChanged = JSON.stringify(oldVal) !== JSON.stringify(newVal);

                                            return (
                                                <tr key={key} className={isChanged ? 'bg-amber-50/40' : 'hover:bg-slate-50'}>
                                                    <td className="px-4 py-3 align-top">
                                                        <span className="text-xs font-semibold text-gray-900 block">
                                                            {getFriendlyFieldLabel(key)}
                                                        </span>
                                                        <span className="text-[10px] font-mono text-gray-400">
                                                            {key}
                                                        </span>
                                                        {isChanged && (
                                                            <span className="inline-block ms-1.5 px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-100 text-amber-800">
                                                                Berubah
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-3 text-rose-900 bg-rose-50/20 border-l border-rose-50 align-top break-words">
                                                        {renderValue(oldVal, true, key)}
                                                    </td>
                                                    <td className="px-4 py-3 text-emerald-950 bg-emerald-50/20 border-l border-emerald-50 align-top break-words">
                                                        {renderValue(newVal, false, key)}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex justify-end p-4 border-t border-gray-100 bg-slate-50">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg bg-gray-200 px-5 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-300 transition"
                    >
                        Tutup Rincian
                    </button>
                </div>
            </div>
        </div>
    );
}
