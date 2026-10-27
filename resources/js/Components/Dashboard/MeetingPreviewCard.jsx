import StatusBadge from '@/Components/StatusBadge';
import { Link } from '@inertiajs/react';
import { Calendar, MapPin } from 'lucide-react';

export default function MeetingPreviewCard({ upcomingMeetings = [] }) {
    const formatDate = (dateStr) => {
        if (!dateStr) return '-';
        return new Date(dateStr).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    const formatTime = (timeStr) => {
        if (!timeStr) return '';
        return timeStr.substring(0, 5) + ' WIB';
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex flex-col justify-between">
            <div>
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                    <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-[#194f2b]" />
                        <h3 className="font-bold text-gray-900 text-sm">Jadwal Rapat Terdekat</h3>
                    </div>
                    <Link
                        href={route('meetings.index')}
                        className="text-xs font-semibold text-emerald-700 hover:text-emerald-800"
                    >
                        Semua ({upcomingMeetings.length})
                    </Link>
                </div>
                <div className="divide-y divide-gray-100 mt-2">
                    {upcomingMeetings.length > 0 ? (
                        upcomingMeetings.map((m) => (
                            <div
                                key={m.id}
                                className="py-3 flex items-start justify-between gap-3 hover:bg-slate-50 px-2 rounded-lg transition"
                            >
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                            {m.meeting_type}
                                        </span>
                                        <StatusBadge status={m.status} type="meeting_status" />
                                    </div>
                                    <h4 className="text-sm font-semibold text-gray-900 mt-1 truncate" title={m.title}>
                                        {m.title}
                                    </h4>
                                    <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                                        <span>
                                            {formatDate(m.meeting_date)} • {formatTime(m.start_time)}
                                        </span>
                                        <span className="flex items-center gap-1 truncate">
                                            <MapPin className="w-3 h-3" />
                                            {m.location}
                                        </span>
                                    </div>
                                </div>
                                <Link
                                    href={route('meetings.show', m.id)}
                                    className="shrink-0 text-xs font-semibold px-2.5 py-1.5 bg-[#194f2b] text-white rounded-md hover:bg-[#123b20] transition mt-1"
                                >
                                    Notulen
                                </Link>
                            </div>
                        ))
                    ) : (
                        <div className="py-8 text-center text-gray-400 text-xs">
                            Tidak ada jadwal rapat mendatang dalam waktu dekat.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
