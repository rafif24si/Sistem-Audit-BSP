import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Pagination from '@/Components/Pagination';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { History, Search, Shield, Filter, RotateCcw } from 'lucide-react';

export default function Index({ logs, actionTypes, filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const [action, setAction] = useState(filters.action || '');

    const handleFilter = (e) => {
        e?.preventDefault();
        router.get(
            route('activity-logs.index'),
            { search: search || undefined, action: action || undefined },
            { preserveState: true, replace: true }
        );
    };

    const handleReset = () => {
        setSearch('');
        setAction('');
        router.get(route('activity-logs.index'), {}, { replace: true });
    };

    const getActionBadge = (act) => {
        const u = act?.toUpperCase() || '';
        if (u.includes('CREATE') || u.includes('STORE')) {
            return 'bg-emerald-100 text-emerald-800 border-emerald-200';
        }
        if (u.includes('UPDATE') || u.includes('EDIT')) {
            return 'bg-amber-100 text-amber-800 border-amber-200';
        }
        if (u.includes('DELETE') || u.includes('DESTROY')) {
            return 'bg-red-100 text-red-800 border-red-200';
        }
        if (u.includes('LOGIN')) {
            return 'bg-blue-100 text-blue-800 border-blue-200';
        }
        if (u.includes('LOGOUT')) {
            return 'bg-slate-100 text-slate-700 border-slate-200';
        }
        return 'bg-purple-100 text-purple-800 border-purple-200';
    };

    const formatDate = (isoString) => {
        if (!isoString) return '-';
        const d = new Date(isoString);
        return d.toLocaleDateString('id-ID', {
            day: '2-digit',
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
                            Log Jejak Audit (Activity Trail)
                        </h2>
                        <p className="text-xs text-gray-500 mt-0.5">
                            Rekam seluruh aktivitas mutasi data dan sesi otentikasi sistem SPI
                        </p>
                    </div>
                    <div className="inline-flex items-center space-x-1.5 rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800 border border-emerald-200">
                        <Shield className="w-4 h-4 text-emerald-600" />
                        <span>Super Admin Restricted</span>
                    </div>
                </div>
            }
        >
            <Head title="Log Jejak Audit - SPI PT BSP" />

            <div className="space-y-5">
                {/* Search & Filter Toolbar */}
                <form
                    onSubmit={handleFilter}
                    className="flex flex-col sm:flex-row gap-3 bg-white p-4 rounded-xl border border-gray-200 shadow-sm"
                >
                    <div className="relative flex-1">
                        <Search className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Cari user, aksi, deskripsi, atau IP..."
                            className="w-full pl-9 pr-4 py-2 text-sm border-gray-300 rounded-lg focus:border-[#194f2b] focus:ring-[#194f2b]"
                        />
                    </div>
                    <div className="sm:w-56">
                        <select
                            value={action}
                            onChange={(e) => setAction(e.target.value)}
                            className="w-full py-2 text-sm border-gray-300 rounded-lg focus:border-[#194f2b] focus:ring-[#194f2b]"
                        >
                            <option value="">Semua Tipe Aksi</option>
                            {actionTypes?.map((act) => (
                                <option key={act} value={act}>
                                    {act}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex gap-2">
                        <button
                            type="submit"
                            className="inline-flex items-center px-4 py-2 bg-[#194f2b] hover:bg-[#123b20] text-white text-sm font-semibold rounded-lg transition"
                        >
                            <Filter className="w-4 h-4 me-1.5" />
                            Filter
                        </button>
                        <button
                            type="button"
                            onClick={handleReset}
                            className="inline-flex items-center px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition"
                        >
                            <RotateCcw className="w-4 h-4" />
                        </button>
                    </div>
                </form>

                {/* Audit Logs Table */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
                            <thead className="bg-slate-50 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                <tr>
                                    <th className="px-5 py-3.5">Waktu</th>
                                    <th className="px-5 py-3.5">Pengguna</th>
                                    <th className="px-5 py-3.5">Aksi</th>
                                    <th className="px-5 py-3.5">Deskripsi</th>
                                    <th className="px-5 py-3.5">IP Address</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {logs.data?.length > 0 ? (
                                    logs.data.map((log) => (
                                        <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                                            <td className="px-5 py-3.5 whitespace-nowrap text-xs text-gray-500 font-mono">
                                                {formatDate(log.created_at)}
                                            </td>
                                            <td className="px-5 py-3.5 whitespace-nowrap">
                                                {log.user ? (
                                                    <div>
                                                        <div className="font-semibold text-gray-900 text-xs">
                                                            {log.user.name}
                                                        </div>
                                                        <div className="text-[11px] text-gray-400 capitalize">
                                                            {log.user.role?.replace('_', ' ')}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <span className="text-xs text-gray-400 italic">Sistem</span>
                                                )}
                                            </td>
                                            <td className="px-5 py-3.5 whitespace-nowrap">
                                                <span
                                                    className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold border ${getActionBadge(
                                                        log.action
                                                    )}`}
                                                >
                                                    {log.action}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3.5 text-xs text-gray-700 max-w-md truncate" title={log.description}>
                                                {log.description}
                                            </td>
                                            <td className="px-5 py-3.5 whitespace-nowrap text-xs font-mono text-gray-500">
                                                {log.ip_address || '-'}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="py-12 text-center text-gray-500">
                                            <History className="mx-auto h-10 w-10 text-gray-300 mb-2" />
                                            <p className="text-sm font-medium">Belum ada data tercatat</p>
                                            <p className="text-xs text-gray-400 mt-1">
                                                Aktivitas pengguna akan terekam otomatis di tabel ini.
                                            </p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <Pagination links={logs.links} />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
