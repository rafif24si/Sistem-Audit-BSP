import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    LayoutDashboard, FileText, Mail, Send, CheckSquare, Calendar, History,
    Users, Building2, DoorClosed, Video, Target, UserCheck, CalendarRange,
    Settings, ChevronDown, ShieldCheck, X, Search
} from 'lucide-react';

export default function Sidebar({ isOpen, onClose }) {
    const { url } = usePage();
    const user = usePage().props.auth.user;
    const isSuperAdmin = user?.role === 'super_admin';
    const [searchQuery, setSearchQuery] = useState('');

    const navItems = [
        { name: 'Dashboard', href: route('dashboard'), icon: LayoutDashboard, active: url === '/dashboard' },
        { name: 'Dokumen Master SOP', href: route('documents.index'), icon: FileText, active: url.startsWith('/documents') },
        { name: 'Surat Internal', href: route('letters.internal'), icon: Mail, active: url.startsWith('/letters/internal') },
        { name: 'Surat Eksternal', href: route('letters.external'), icon: Send, active: url.startsWith('/letters/external') },
        { name: 'Lembar Disposisi', href: route('dispositions.index'), icon: CheckSquare, active: url.startsWith('/dispositions') },
        { name: 'Manajemen Rapat & E-Notulen', href: route('meetings.index'), icon: Calendar, active: url.startsWith('/meetings') },
    ];

    const adminNavItems = [
        { name: 'Kelola Pengguna', href: route('users.index'), icon: Users, active: url.startsWith('/users') },
        { name: 'Hak Akses & PJS', href: route('permissions.index'), icon: ShieldCheck, active: url.startsWith('/permissions') },
        { name: 'Data Master Departemen', href: route('departments.index'), icon: Building2, active: url.startsWith('/departments') },
        { name: 'Data Master Pegawai', href: route('employees.index'), icon: UserCheck, active: url.startsWith('/employees') },
        { name: 'Data Master Jenis Rapat', href: route('meeting-types.index'), icon: Calendar, active: url.startsWith('/meeting-types') },
        { name: 'Data Master Ruang Rapat', href: route('meeting-rooms.index'), icon: DoorClosed, active: url.startsWith('/meeting-rooms') },
        { name: 'Data Master Platform Rapat', href: route('meeting-platforms.index'), icon: Video, active: url.startsWith('/meeting-platforms') },
        { name: 'Data Master Kategori KPI', href: route('kpi-categories.index'), icon: Target, active: url.startsWith('/kpi-categories') },
        { name: 'Data Master Periode KPI', href: route('kpi-periods.index'), icon: CalendarRange, active: url.startsWith('/kpi-periods') },
        { name: 'Log Aktivitas (Audit Trail)', href: route('activity-logs.index'), icon: History, active: url.startsWith('/activity-logs') },
    ];

    const isAnyAdminActive = adminNavItems.some((item) => item.active);
    const [isAdminOpen, setIsAdminOpen] = useState(isAnyAdminActive);

    const q = searchQuery.toLowerCase().trim();
    const visibleNavItems = navItems.filter((i) => i.name.toLowerCase().includes(q));
    const visibleAdminNavItems = adminNavItems.filter((i) => i.name.toLowerCase().includes(q));
    const showAdminSection = isSuperAdmin && (isAdminOpen || (q.length > 0 && visibleAdminNavItems.length > 0));

    return (
        <>
            {isOpen && <div onClick={onClose} className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden" />}

            <aside className={`fixed top-0 bottom-0 left-0 z-50 flex w-72 flex-col bg-[#194f2b] text-white transition-transform duration-300 ease-in-out lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                {/* Branding Header */}
                <div className="relative flex h-20 items-center justify-center border-b border-white/10 px-6">
                    <div className="flex h-14 items-center justify-center rounded-xl bg-white px-5 py-2 shadow-sm ring-1 ring-white/20">
                        <img src="/images/logo.png" alt="Logo PT Bumi Siak Pusako" className="h-10 w-auto object-contain" />
                    </div>
                    <button onClick={onClose} className="absolute right-4 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-emerald-200 hover:bg-white/10 lg:hidden" aria-label="Tutup menu">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Navigation links & Search */}
                <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
                    {/* Search Menu Input */}
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-emerald-300/80" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Cari navigasi menu..."
                            className="w-full pl-8 pr-3 py-1.5 bg-black/20 border border-white/15 rounded-lg text-xs text-white placeholder-emerald-200/50 focus:outline-none focus:ring-1 focus:ring-emerald-400 focus:border-emerald-400"
                        />
                        {searchQuery && (
                            <button onClick={() => setSearchQuery('')} className="absolute right-2.5 top-2.5 text-emerald-300/80 hover:text-white">
                                <X className="h-3.5 w-3.5" />
                            </button>
                        )}
                    </div>

                    {/* Main Navigation */}
                    {visibleNavItems.length > 0 && (
                        <div>
                            <div className="px-3 pb-1.5 text-[11px] font-semibold uppercase tracking-wider text-emerald-200/60">
                                Menu Utama
                            </div>
                            <nav className="space-y-1">
                                {visibleNavItems.map((item) => {
                                    const Icon = item.icon;
                                    return (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            className={`group flex items-center rounded-lg px-3.5 py-2 text-sm font-medium transition-all ${item.active ? 'bg-[#246b3c] text-white shadow-sm ring-1 ring-white/10' : 'text-emerald-100/90 hover:bg-white/10 hover:text-white'}`}
                                        >
                                            <Icon className={`me-3 h-4 w-4 flex-shrink-0 transition-colors ${item.active ? 'text-emerald-300' : 'text-emerald-200/70 group-hover:text-emerald-200'}`} />
                                            <span>{item.name}</span>
                                        </Link>
                                    );
                                })}
                            </nav>
                        </div>
                    )}

                    {/* Admin Section */}
                    {isSuperAdmin && (visibleAdminNavItems.length > 0 || q.length === 0) && (
                        <div className="pt-2 border-t border-white/10">
                            <button
                                type="button"
                                onClick={() => setIsAdminOpen(!isAdminOpen)}
                                className={`w-full group flex items-center justify-between rounded-lg px-3.5 py-2 text-sm font-medium transition-all ${isAnyAdminActive ? 'text-white bg-white/10 font-semibold' : 'text-emerald-100/90 hover:bg-white/10 hover:text-white'}`}
                            >
                                <div className="flex items-center">
                                    <Settings className="me-3 h-4 w-4 flex-shrink-0 text-emerald-300" />
                                    <span>Pengaturan Sistem</span>
                                </div>
                                <ChevronDown className={`h-4 w-4 text-emerald-300 transition-transform duration-300 ${showAdminSection ? 'rotate-180' : ''}`} />
                            </button>

                            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${showAdminSection ? 'max-h-96 opacity-100 mt-1' : 'max-h-0 opacity-0'}`}>
                                <div className="space-y-1 pl-3 border-l-2 border-white/15 ml-4 my-1">
                                    {visibleAdminNavItems.map((adminItem) => {
                                        const AdminIcon = adminItem.icon;
                                        return (
                                            <Link
                                                key={adminItem.name}
                                                href={adminItem.href}
                                                className={`group flex items-center rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${adminItem.active ? 'bg-[#246b3c] text-white shadow-xs font-semibold' : 'text-emerald-100/80 hover:bg-white/10 hover:text-white'}`}
                                            >
                                                <AdminIcon className={`me-2.5 h-3.5 w-3.5 flex-shrink-0 transition-colors ${adminItem.active ? 'text-emerald-300' : 'text-emerald-200/70 group-hover:text-emerald-200'}`} />
                                                <span>{adminItem.name}</span>
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}

                    {visibleNavItems.length === 0 && visibleAdminNavItems.length === 0 && (
                        <div className="py-6 text-center text-xs text-emerald-200/60">
                            Tidak ada menu yang sesuai "{searchQuery}"
                        </div>
                    )}
                </div>

                {/* Branding Footer */}
                <div className="border-t border-white/10 p-3.5">
                    <div className="rounded-xl bg-white/5 px-3 py-2 text-center ring-1 ring-white/10">
                        <p className="text-xs font-bold tracking-wider text-white uppercase">SPI PT BSP</p>
                        <p className="mt-0.5 text-[10px] font-medium text-emerald-200/80">Sistem Integrasi Audit</p>
                    </div>
                </div>
            </aside>
        </>
    );
}
