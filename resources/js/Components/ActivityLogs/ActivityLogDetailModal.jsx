import { X, History, ArrowRight } from 'lucide-react';

export default function ActivityLogDetailModal({ isOpen, onClose, log = null }) {
    if (!isOpen || !log) return null;

    const oldVals = log.old_values || {};
    const newVals = log.new_values || {};
    const allKeys = Array.from(new Set([...Object.keys(oldVals), ...Object.keys(newVals)]));

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
            <div className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl my-8 overflow-hidden">
                <div className="flex items-center justify-between border-b border-gray-100 bg-[#194f2b] px-6 py-4 text-white">
                    <div className="flex items-center space-x-2">
                        <History className="h-5 w-5 text-emerald-300" />
                        <h3 className="text-base font-bold">Rincian Perubahan Log Aktivitas</h3>
                    </div>
                    <button onClick={onClose} className="rounded-lg p-1 text-emerald-200 hover:bg-white/10">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1">
                        <div><strong className="text-gray-700">Aksi:</strong> <span className="font-mono text-emerald-800">{log.action}</span></div>
                        <div><strong className="text-gray-700">Pelaksana:</strong> <span>{log.user?.name || 'Sistem'} ({log.user?.role || '-'})</span></div>
                        <div><strong className="text-gray-700">Deskripsi:</strong> <span>{log.description}</span></div>
                        <div><strong className="text-gray-700">IP Address:</strong> <span className="font-mono">{log.ip_address || '-'}</span></div>
                    </div>

                    <div>
                        <h4 className="font-bold text-gray-900 mb-2 text-sm">Komparasi Nilai (Sebelum vs Sesudah)</h4>
                        {allKeys.length === 0 ? (
                            <p className="text-gray-400 italic">Tidak ada rincian snapshot atribut untuk aktivitas ini.</p>
                        ) : (
                            <div className="border border-gray-200 rounded-lg overflow-hidden">
                                <table className="min-w-full divide-y divide-gray-200 text-left">
                                    <thead className="bg-gray-100 text-[11px] font-semibold text-gray-700 uppercase">
                                        <tr>
                                            <th className="px-3 py-2">Field</th>
                                            <th className="px-3 py-2 bg-rose-50/50 text-rose-900">Nilai Lama</th>
                                            <th className="px-3 py-2 bg-emerald-50/50 text-emerald-900">Nilai Baru</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 bg-white">
                                        {allKeys.map((key) => {
                                            const oldVal = oldVals[key];
                                            const newVal = newVals[key];
                                            const isChanged = JSON.stringify(oldVal) !== JSON.stringify(newVal);

                                            return (
                                                <tr key={key} className={isChanged ? 'bg-amber-50/30' : ''}>
                                                    <td className="px-3 py-2 font-mono text-gray-600 font-semibold">{key}</td>
                                                    <td className="px-3 py-2 font-mono text-rose-700 break-all bg-rose-50/20">
                                                        {oldVal !== null && oldVal !== undefined ? String(oldVal) : <span className="text-gray-300 italic">null</span>}
                                                    </td>
                                                    <td className="px-3 py-2 font-mono text-emerald-700 break-all bg-emerald-50/20">
                                                        {newVal !== null && newVal !== undefined ? String(newVal) : <span className="text-gray-300 italic">null</span>}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end pt-3 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-lg bg-gray-100 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-200"
                        >
                            Tutup
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

