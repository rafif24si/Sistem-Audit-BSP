import StatusBadge from '@/Components/StatusBadge';
import { Link } from '@inertiajs/react';
import { Send, ChevronRight } from 'lucide-react';

export default function PendingFollowupCard({ pendingFollowups = [] }) {
    const formatDate = (dateStr) => {
        if (!dateStr) return '-';
        return new Date(dateStr).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex flex-col justify-between">
            <div>
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                    <div className="flex items-center space-x-2">
                        <Send className="w-4 h-4 text-[#194f2b]" />
                        <h3 className="font-bold text-gray-900 text-sm">Surat Eksternal Butuh Follow-Up</h3>
                    </div>
                    <Link
                        href={route('letters.external')}
                        className="text-xs font-semibold text-emerald-700 hover:text-emerald-800"
                    >
                        Semua
                    </Link>
                </div>
                <div className="divide-y divide-gray-100 mt-2">
                    {pendingFollowups.length > 0 ? (
                        pendingFollowups.map((letItem) => (
                            <div
                                key={letItem.id}
                                className="py-3 flex items-start justify-between gap-3 hover:bg-slate-50 px-2 rounded-lg transition"
                            >
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2">
                                        <span className="font-mono text-xs font-bold text-gray-800">
                                            {letItem.letter_number}
                                        </span>
                                        <StatusBadge status={letItem.followup_status} type="followup" />
                                    </div>
                                    <h4 className="text-sm font-medium text-gray-900 mt-1 truncate" title={letItem.subject}>
                                        {letItem.subject}
                                    </h4>
                                    <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                                        <span>Pengirim: {letItem.sender}</span>
                                        {letItem.followup_due_date && (
                                            <span className="text-rose-600 font-semibold">
                                                Batas: {formatDate(letItem.followup_due_date)}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <Link
                                    href={route('letters.external')}
                                    className="shrink-0 p-1.5 text-gray-400 hover:text-[#194f2b] transition mt-1"
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </Link>
                            </div>
                        ))
                    ) : (
                        <div className="py-8 text-center text-gray-400 text-xs">
                            Seluruh surat eksternal telah selesai ditindaklanjuti.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
