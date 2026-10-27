import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import KpiCard from '@/Components/Dashboard/KpiCard';
import MeetingPreviewCard from '@/Components/Dashboard/MeetingPreviewCard';
import PendingFollowupCard from '@/Components/Dashboard/PendingFollowupCard';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    ShieldCheck,
    FileText,
    CheckSquare,
    Clock,
    Calendar,
    History,
} from 'lucide-react';

export default function Dashboard({
    stats = {},
    upcomingMeetings = [],
    pendingFollowups = [],
    recentActivities = [],
}) {
    const user = usePage().props.auth.user;

    const kpiCards = [
        {
            title: 'Dokumen Terkendali',
            count: stats.controlled_documents ?? 0,
            sub: 'SOP & Manual Aktif',
            href: route('documents.index'),
            icon: FileText,
            iconColor: 'bg-emerald-600 text-white',
        },
        {
            title: 'Disposisi Tertunda',
            count: stats.pending_dispositions ?? 0,
            sub: 'Surat Masuk Menunggu Arahan',
            href: route('dispositions.index'),
            icon: CheckSquare,
            iconColor: 'bg-amber-600 text-white',
        },
        {
            title: 'Follow-Up Eksternal',
            count: stats.pending_followups ?? 0,
            sub: 'Surat Butuh Tindak Lanjut',
            href: route('letters.external'),
            icon: Clock,
            iconColor: 'bg-rose-600 text-white',
        },
        {
            title: 'Jadwal Rapat Terdekat',
            count: stats.upcoming_meetings ?? 0,
            sub: 'Entry / Exit / Rutin',
            href: route('meetings.index'),
            icon: Calendar,
            iconColor: 'bg-blue-600 text-white',
        },
    ];

    const formatDate = (dateStr) => {
        if (!dateStr) return '-';
        return new Date(dateStr).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 leading-tight">
                            Dashboard Pengawasan
                        </h2>
                        <p className="text-xs text-gray-500 mt-0.5">
                            Satuan Pengawasan Intern PT Bumi Siak Pusako
                        </p>
                    </div>
                    <div className="inline-flex items-center space-x-2 text-xs font-medium text-gray-600 bg-white border border-gray-200 px-3 py-1.5 rounded-lg shadow-sm">
                        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span>Portal Terintegrasi SPI</span>
                    </div>
                </div>
            }
        >
            <Head title="Dashboard - SPI PT Bumi Siak Pusako" />

            <div className="space-y-6">
                {/* Hero Greeting Card */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#194f2b] to-[#25733f] p-6 text-white shadow-md">
                    <div className="relative z-10 max-w-2xl">
                        <div className="inline-flex items-center space-x-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-emerald-200 backdrop-blur-sm mb-3">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>
                                Role: {user?.role?.replace('_', ' ').toUpperCase()} • {user?.department?.name || 'SPI'}
                            </span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                            Selamat Datang, {user?.name}!
                        </h1>
                        <p className="mt-2 text-sm text-emerald-100/90 leading-relaxed">
                            Integrasi kendali dokumen SOP baku, disposisi surat, risalah rapat audit, dan jejak pengawasan secara terpusat.
                        </p>
                    </div>
                </div>

                {/* 4 KPI Stat Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {kpiCards.map((card) => (
                        <KpiCard key={card.title} {...card} />
                    ))}
                </div>

                {/* Two-Column Section: Upcoming Meetings & Pending Follow-Ups */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <MeetingPreviewCard upcomingMeetings={upcomingMeetings} />
                    <PendingFollowupCard pendingFollowups={pendingFollowups} />
                </div>

                {/* Audit Trail Activity Feed */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                    <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                        <div className="flex items-center space-x-2">
                            <History className="w-4 h-4 text-[#194f2b]" />
                            <h3 className="font-bold text-gray-900 text-sm">Jejak Audit Terkini (Activity Log)</h3>
                        </div>
                        {user?.role === 'super_admin' && (
                            <Link
                                href={route('activity-logs.index')}
                                className="text-xs font-semibold text-emerald-700 hover:text-emerald-800"
                            >
                                Lihat Semua Log
                            </Link>
                        )}
                    </div>
                    <div className="mt-3 divide-y divide-gray-100">
                        {recentActivities.length > 0 ? (
                            recentActivities.map((act) => (
                                <div key={act.id} className="py-2.5 flex items-center justify-between text-xs gap-3">
                                    <div className="flex items-center space-x-3 min-w-0">
                                        <span className="font-mono text-gray-400 whitespace-nowrap">
                                            {formatDate(act.created_at)}
                                        </span>
                                        <span className="font-semibold text-gray-900 whitespace-nowrap">
                                            {act.user?.name || 'Sistem'}
                                        </span>
                                        <span className="text-gray-600 truncate max-w-md" title={act.description}>
                                            {act.description}
                                        </span>
                                    </div>
                                    <span className="font-mono text-[11px] text-gray-400 whitespace-nowrap">
                                        {act.ip_address}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <div className="py-6 text-center text-gray-400 text-xs">
                                Belum ada catatan aktivitas sistem terkini.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
