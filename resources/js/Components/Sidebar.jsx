import { Link, usePage } from '@inertiajs/react';
import {
    LayoutDashboard,
    FileText,
    Mail,
    Send,
    CheckSquare,
    Calendar,
    History,
    X,
} from 'lucide-react';

export default function Sidebar({ isOpen, onClose }) {
    const { url } = usePage();
    const user = usePage().props.auth.user;

    const navItems = [
        {
            name: 'Dashboard',
            href: route('dashboard'),
            icon: LayoutDashboard,
            active: url === '/dashboard',
        },
        {
            name: 'Dokumen Master SOP',
            href: route('documents.index'),
            icon: FileText,
            active: url.startsWith('/documents'),
        },
        {
            name: 'Surat Internal',
            href: route('letters.internal'),
            icon: Mail,
            active: url.startsWith('/letters/internal'),
        },
        {
            name: 'Surat Eksternal',
            href: route('letters.external'),
            icon: Send,
            active: url.startsWith('/letters/external'),
        },
        {
            name: 'Lembar Disposisi',
            href: route('dispositions.index'),
            icon: CheckSquare,
            active: url.startsWith('/dispositions'),
        },
        {
            name: 'Jadwal & E-Notulen',
            href: route('meetings.index'),
            icon: Calendar,
            active: url.startsWith('/meetings'),
        },
    ];

    if (user?.role === 'super_admin') {
        navItems.push({
            name: 'Log Aktivitas (Audit)',
            href: route('activity-logs.index'),
            icon: History,
            active: url.startsWith('/activity-logs'),
        });
    }

    return (
        <>
            {/* Mobile backdrop */}
            {isOpen && (
                <div
                    onClick={onClose}
                    className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden"
                />
            )}

            {/* Sidebar drawer */}
            <aside
                className={`fixed top-0 bottom-0 left-0 z-50 flex w-72 flex-col bg-[#194f2b] text-white transition-transform duration-300 ease-in-out lg:translate-x-0 ${
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                {/* Branding Header */}
                <div className="flex h-16 items-center justify-between border-b border-white/10 px-6">
                    <div className="flex items-center space-x-3">
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-white p-0.5 shadow-md ring-2 ring-emerald-400/30">
                            <img
                                src="/images/logo.png"
                                alt="Logo PT Bumi Siak Pusako"
                                className="h-full w-full rounded-full object-cover"
                            />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-base font-bold tracking-tight text-white leading-tight">
                                SPI PT BSP
                            </span>
                            <span className="text-[11px] text-emerald-200/80 leading-tight">
                                Sistem Integrasi Audit
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-lg p-1.5 text-emerald-200 hover:bg-white/10 lg:hidden"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Navigation links */}
                <div className="flex-1 overflow-y-auto px-4 py-5">
                    <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-emerald-200/60">
                        Menu Utama
                    </div>
                    <nav className="space-y-1.5">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`group flex items-center rounded-lg px-3.5 py-2.5 text-sm font-medium transition-all ${
                                        item.active
                                            ? 'bg-[#246b3c] text-white shadow-sm ring-1 ring-white/10'
                                            : 'text-emerald-100/90 hover:bg-white/10 hover:text-white'
                                    }`}
                                >
                                    <Icon
                                        className={`me-3 h-5 w-5 flex-shrink-0 transition-colors ${
                                            item.active
                                                ? 'text-emerald-300'
                                                : 'text-emerald-200/70 group-hover:text-emerald-200'
                                        }`}
                                    />
                                    <span>{item.name}</span>
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* Sidebar footer badge */}
                <div className="border-t border-white/10 p-4">
                    <div className="flex items-center space-x-3 rounded-lg bg-emerald-950/40 p-3 ring-1 ring-white/5">
                        <img
                            src="/images/logo.png"
                            alt="Logo PT BSP"
                            className="h-8 w-8 flex-shrink-0 rounded-full object-cover ring-1 ring-emerald-400/30"
                        />
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-xs font-semibold text-emerald-200">
                                PT Bumi Siak Pusako
                            </p>
                            <p className="truncate text-[11px] text-emerald-300/70">
                                Satuan Pengawasan Intern
                            </p>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
}
