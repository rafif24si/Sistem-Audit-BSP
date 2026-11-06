import { useState, useRef, useEffect } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import {
    Bell,
    Mail,
    Calendar,
    FileText,
    CheckSquare,
    Clock,
    CheckCheck,
} from 'lucide-react';

export default function NotificationDropdown() {
    const { notifications = { count: 0, items: [] } } = usePage().props;
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleMarkAllAsRead = (e) => {
        e.preventDefault();
        e.stopPropagation();
        router.post(route('notifications.mark-all-as-read'), {}, {
            preserveScroll: true,
        });
    };

    const handleItemClick = (item) => {
        setIsOpen(false);
        if (!item.read) {
            router.post(route('notifications.mark-as-read', item.id), {}, {
                preserveScroll: true,
            });
        }
    };

    const renderIcon = (type) => {
        switch (type) {
            case 'meeting':
                return (
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                        <Calendar className="h-4 w-4" />
                    </div>
                );
            case 'disposition':
                return (
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
                        <FileText className="h-4 w-4" />
                    </div>
                );
            case 'approval':
                return (
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
                        <CheckSquare className="h-4 w-4" />
                    </div>
                );
            case 'followup':
                return (
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                        <Clock className="h-4 w-4" />
                    </div>
                );
            default:
                return (
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800">
                        <Mail className="h-4 w-4" />
                    </div>
                );
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-gray-500 hover:text-[#194f2b] hover:bg-emerald-50 rounded-full transition focus:outline-none"
                title="Notifikasi & Tindak Lanjut"
            >
                <Bell className="w-5 h-5" />
                {notifications.count > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-[1rem] px-1 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white ring-2 ring-white animate-pulse">
                        {notifications.count}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl bg-white shadow-2xl ring-1 ring-black/5 z-50 overflow-hidden">
                    {/* Header */}
                    <div className="bg-[#194f2b] px-4 py-3 text-white flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <span className="text-xs font-bold tracking-wide">Pemberitahuan Sistem</span>
                            {notifications.count > 0 && (
                                <span className="text-[10px] bg-red-500 text-white px-2 py-0.5 rounded-full font-bold">
                                    {notifications.count} Baru
                                </span>
                            )}
                        </div>
                        {notifications.count > 0 && (
                            <button
                                type="button"
                                onClick={handleMarkAllAsRead}
                                className="inline-flex items-center text-[11px] font-medium text-emerald-100 hover:text-white hover:underline transition"
                            >
                                <CheckCheck className="w-3.5 h-3.5 me-1" />
                                Tandai semua dibaca
                            </button>
                        )}
                    </div>

                    {/* List of Itemized Notifications */}
                    <div className="max-h-80 overflow-y-auto divide-y divide-gray-100">
                        {notifications.items?.length > 0 ? (
                            notifications.items.map((item) => (
                                <Link
                                    key={item.id}
                                    href={item.url}
                                    onClick={() => handleItemClick(item)}
                                    className={`flex items-start gap-3 p-3.5 transition ${
                                        !item.read
                                            ? 'bg-emerald-50/60 hover:bg-emerald-100/70 border-l-4 border-[#194f2b]'
                                            : 'bg-white hover:bg-slate-50 border-l-4 border-transparent'
                                    }`}
                                >
                                    {renderIcon(item.type)}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-2">
                                            <p className={`text-xs truncate ${!item.read ? 'font-bold text-gray-900' : 'font-medium text-gray-700'}`}>
                                                {item.title}
                                            </p>
                                            <span className="text-[10px] text-gray-400 whitespace-nowrap shrink-0">
                                                {item.created_at}
                                            </span>
                                        </div>
                                        <p className="text-[11px] text-gray-600 line-clamp-2 mt-0.5 leading-snug">
                                            {item.message}
                                        </p>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <div className="py-8 text-center px-4">
                                <Bell className="w-8 h-8 mx-auto text-gray-300 mb-2" />
                                <p className="text-xs font-medium text-gray-500">Tidak ada notifikasi saat ini</p>
                                <p className="text-[11px] text-gray-400 mt-0.5">Semua tugas dan persetujuan telah selesai diproses.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

