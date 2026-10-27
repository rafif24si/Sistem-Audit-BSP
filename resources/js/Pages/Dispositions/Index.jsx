import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react';
import StatusBadge from '@/Components/StatusBadge';
import Pagination from '@/Components/Pagination';
import DispositionModal from '@/Components/Dispositions/DispositionModal';
import CompleteDispositionModal from '@/Components/Dispositions/CompleteDispositionModal';
import { Plus, Search, CheckSquare, Edit, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';

export default function Index({ dispositions, incomingLetters, staffUsers, filters }) {
    const user = usePage().props.auth.user;
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
    const [selectedDisposition, setSelectedDisposition] = useState(null);

    const [search, setSearch] = useState(filters.search || '');
    const [urgencyFilter, setUrgencyFilter] = useState(filters.urgency || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || '');
    const activeTab = filters.tab || (['super_admin', 'manager_spi'].includes(user?.role) ? 'all' : 'received');

    const handleFilterChange = (newFilters = {}) => {
        router.get(
            route('dispositions.index'),
            {
                tab: activeTab,
                search: newFilters.search !== undefined ? newFilters.search : search,
                urgency: newFilters.urgency !== undefined ? newFilters.urgency : urgencyFilter,
                status: newFilters.status !== undefined ? newFilters.status : statusFilter,
            },
            { preserveState: true, replace: true }
        );
    };

    const handleTabChange = (tabName) => {
        router.get(route('dispositions.index'), { ...filters, tab: tabName }, { preserveState: true });
    };

    const handleDelete = (disp) => {
        if (confirm('Apakah Anda yakin ingin menghapus lembar disposisi ini?')) {
            router.delete(route('dispositions.destroy', disp.id));
        }
    };

    const canCreate = ['super_admin', 'manager_spi'].includes(user?.role);

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 leading-tight">Lembar Disposisi Digital</h2>
                        <p className="text-xs text-gray-500 mt-0.5">Pendelegasian instruksi dan tindak lanjut pimpinan audit pada surat masuk SPI PT BSP</p>
                    </div>
                    {canCreate && (
                        <button
                            onClick={() => { setSelectedDisposition(null); setIsCreateModalOpen(true); }}
                            className="inline-flex items-center rounded-lg bg-[#194f2b] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#123b20]"
                        >
                            <Plus className="me-1.5 h-4 w-4" />
                            Terbitkan Disposisi
                        </button>
                    )}
                </div>
            }
        >
            <Head title="Lembar Disposisi - SPI PT BSP" />

            {/* Tabs */}
            <div className="border-b border-gray-200 mb-6 bg-white rounded-t-xl px-4 pt-2 shadow-sm">
                <nav className="flex space-x-6">
                    <button
                        onClick={() => handleTabChange('all')}
                        className={`py-3 px-1 border-b-2 text-sm font-semibold transition-colors ${
                            activeTab === 'all' ? 'border-emerald-700 text-emerald-800' : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        Semua Disposisi
                    </button>
                    <button
                        onClick={() => handleTabChange('received')}
                        className={`py-3 px-1 border-b-2 text-sm font-semibold transition-colors ${
                            activeTab === 'received' ? 'border-blue-600 text-blue-700' : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        Tugas Saya (Disposisi Masuk)
                    </button>
                    <button
                        onClick={() => handleTabChange('given')}
                        className={`py-3 px-1 border-b-2 text-sm font-semibold transition-colors ${
                            activeTab === 'given' ? 'border-purple-600 text-purple-700' : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        Instruksi Saya (Disposisi Keluar)
                    </button>
                </nav>
            </div>

            {/* Filter Bar */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <div className="relative sm:col-span-2">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleFilterChange({ search })}
                            placeholder="Cari perihal, nomor surat, penerima, atau arahan..."
                            className="w-full pl-9 rounded-lg border-gray-300 text-sm focus:border-emerald-600 focus:ring-emerald-600"
                        />
                    </div>
                    <div>
                        <select
                            value={urgencyFilter}
                            onChange={(e) => { setUrgencyFilter(e.target.value); handleFilterChange({ urgency: e.target.value }); }}
                            className="w-full rounded-lg border-gray-300 text-sm focus:border-emerald-600 focus:ring-emerald-600"
                        >
                            <option value="">Semua Kecepatan</option>
                            <option value="Biasa">Biasa</option>
                            <option value="Segera">Segera</option>
                            <option value="Kilat">Kilat</option>
                        </select>
                    </div>
                    <div>
                        <select
                            value={statusFilter}
                            onChange={(e) => { setStatusFilter(e.target.value); handleFilterChange({ status: e.target.value }); }}
                            className="w-full rounded-lg border-gray-300 text-sm focus:border-emerald-600 focus:ring-emerald-600"
                        >
                            <option value="">Semua Status</option>
                            <option value="pending">Belum Diproses</option>
                            <option value="in_progress">Dalam Proses</option>
                            <option value="completed">Selesai</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Data Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
                        <thead className="bg-slate-50 text-xs uppercase font-semibold text-gray-600">
                            <tr>
                                <th className="px-6 py-3.5">Surat Masuk</th>
                                <th className="px-6 py-3.5">Instruksi & Arahan</th>
                                <th className="px-6 py-3.5">Pemberi & Penerima</th>
                                <th className="px-6 py-3.5">Kecepatan & Batas</th>
                                <th className="px-6 py-3.5">Status</th>
                                <th className="px-6 py-3.5 text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 bg-white">
                            {dispositions.data.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="py-12 text-center text-gray-400">
                                        <CheckSquare className="mx-auto h-8 w-8 text-gray-300 mb-2" />
                                        Belum ada lembar disposisi tercatat
                                    </td>
                                </tr>
                            ) : (
                                dispositions.data.map((disp) => {
                                    const isRecipient = user?.id === disp.to_user_id;
                                    const isSender = user?.id === disp.from_user_id || user?.role === 'super_admin';

                                    return (
                                        <tr key={disp.id} className="hover:bg-slate-50/80 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="font-mono font-medium text-xs text-emerald-950">{disp.letter?.letter_number}</div>
                                                <div className="font-semibold text-gray-900 text-xs max-w-xs mt-0.5 line-clamp-2">{disp.letter?.subject}</div>
                                                <div className="text-[11px] text-gray-400 mt-0.5">Asal: {disp.letter?.sender}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-emerald-900 text-xs">{disp.instruction}</div>
                                                {disp.notes ? (
                                                    <p className="text-xs text-gray-600 mt-1 max-w-xs line-clamp-2">{disp.notes}</p>
                                                ) : (
                                                    <span className="text-xs text-gray-400 italic">Tanpa catatan tambahan</span>
                                                )}
                                                {disp.completion_notes && (
                                                    <div className="mt-1.5 rounded bg-emerald-50 p-1.5 text-[11px] text-emerald-800 border border-emerald-200">
                                                        <span className="font-semibold">Laporan:</span> {disp.completion_notes}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-xs">
                                                <div><span className="text-gray-400">Dari:</span> <span className="font-medium text-gray-800">{disp.sender?.name}</span></div>
                                                <div className="mt-1"><span className="text-gray-400">Kepada:</span> <span className="font-medium text-emerald-800">{disp.recipient?.name}</span></div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <StatusBadge status={disp.urgency} type="urgency" />
                                                <div className="text-xs text-gray-600 mt-1">Tenggat: <span className="font-semibold">{disp.due_date}</span></div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <StatusBadge status={disp.status} type="disposition_status" />
                                                {disp.completed_at && <div className="text-[10px] text-gray-400 mt-1">Selesai: {disp.completed_at.substring(0, 10)}</div>}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <div className="inline-flex items-center space-x-1.5">
                                                    {(isRecipient || isSender) && (
                                                        <button
                                                            onClick={() => { setSelectedDisposition(disp); setIsCompleteModalOpen(true); }}
                                                            className="inline-flex items-center px-2 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 rounded-lg hover:bg-emerald-100"
                                                            title="Laporkan Tindak Lanjut"
                                                        >
                                                            <CheckCircle2 className="h-3.5 w-3.5 me-1" />
                                                            Tindak Lanjut
                                                        </button>
                                                    )}
                                                    {isSender && (
                                                        <>
                                                            <button
                                                                onClick={() => { setSelectedDisposition(disp); setIsCreateModalOpen(true); }}
                                                                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"
                                                                title="Ubah Disposisi"
                                                            >
                                                                <Edit className="h-4 w-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(disp)}
                                                                className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
                                                                title="Hapus Disposisi"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
                <Pagination links={dispositions.links} />
            </div>

            {/* Modals */}
            <DispositionModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                disposition={selectedDisposition}
                incomingLetters={incomingLetters}
                staffUsers={staffUsers}
            />

            <CompleteDispositionModal
                isOpen={isCompleteModalOpen}
                onClose={() => setIsCompleteModalOpen(false)}
                disposition={selectedDisposition}
            />
        </AuthenticatedLayout>
    );
}
