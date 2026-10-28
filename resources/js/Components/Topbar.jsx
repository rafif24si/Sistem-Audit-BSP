import { useState, useRef, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Menu, User, LogOut, ChevronDown, Building2 } from 'lucide-react';

export default function Topbar({ onMenuClick }) {
    const user = usePage().props.auth.user;
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const roleLabels = {
        super_admin: 'Super Admin',
        manager_spi: 'Manager SPI',
        auditor: 'Auditor SPI',
        auditee: 'Auditee',
    };

    const roleBadgeStyles = {
        super_admin: 'bg-purple-100 text-purple-800 border-purple-200',
        manager_spi: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        auditor: 'bg-blue-100 text-blue-800 border-blue-200',
        auditee: 'bg-amber-100 text-amber-800 border-amber-200',
    };

    return (
        <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-gray-200 bg-white px-4 sm:px-6 lg:px-8 shadow-sm">
            <div className="flex items-center space-x-3">
                <button
                    type="button"
                    onClick={onMenuClick}
                    className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 focus:outline-none lg:hidden"
                >
                    <Menu className="h-6 w-6" />
                </button>

                {user?.department && (
                    <div className="hidden sm:flex items-center text-xs text-gray-500 bg-slate-100 px-3 py-1.5 rounded-full border border-gray-200">
                        <Building2 className="w-3.5 h-3.5 me-1.5 text-gray-400" />
                        <span>{user.department.name} ({user.department.code})</span>
                    </div>
                )}
            </div>

            <div className="flex items-center space-x-3">
                <div className="relative" ref={dropdownRef}>
                    <button
                        type="button"
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className="flex items-center space-x-3 rounded-full p-1.5 transition-colors hover:bg-gray-50 focus:outline-none"
                    >
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#194f2b] text-white text-sm font-semibold shadow-inner">
                            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div className="hidden text-left md:block">
                            <div className="text-sm font-medium text-gray-800 leading-tight">
                                {user?.name}
                            </div>
                            <span className={`inline-block mt-0.5 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${roleBadgeStyles[user?.role] || 'bg-gray-100 text-gray-700'}`}>
                                {roleLabels[user?.role] || user?.role}
                            </span>
                        </div>
                        <ChevronDown className="h-4 w-4 text-gray-400 hidden md:block" />
                    </button>

                    {dropdownOpen && (
                        <div className="absolute right-0 mt-2 w-56 rounded-lg bg-white py-1.5 shadow-xl ring-1 ring-black ring-opacity-5 z-50">
                            <div className="border-b border-gray-100 px-4 py-2.5 md:hidden">
                                <div className="text-sm font-medium text-gray-800">{user?.name}</div>
                                <div className="text-xs text-gray-500">{user?.email}</div>
                                <span className={`inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${roleBadgeStyles[user?.role]}`}>
                                    {roleLabels[user?.role]}
                                </span>
                            </div>

                            <Link
                                href={route('profile.edit')}
                                onClick={() => setDropdownOpen(false)}
                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-800"
                            >
                                <User className="me-2.5 h-4 w-4 text-gray-400" />
                                Pengaturan Profil
                            </Link>

                            <Link
                                href={route('logout')}
                                method="post"
                                as="button"
                                className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                            >
                                <LogOut className="me-2.5 h-4 w-4 text-red-500" />
                                Log Out
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
