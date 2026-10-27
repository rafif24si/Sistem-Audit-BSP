import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import StatusBadge from '@/Components/StatusBadge';
import Pagination from '@/Components/Pagination';
import LetterModal from '@/Components/Letters/LetterModal';
import FollowUpModal from '@/Components/Letters/FollowUpModal';
import { Plus, Search, Download, Edit, Trash2, Send, CheckCircle2, ArrowDownLeft, ArrowUpRight } from 'lucide-react';

export default function External({ letters, filters }) {
    const [isLetterModalOpen, setIsLetterModalOpen] = useState(false);
    const [isFollowUpModalOpen, setIsFollowUpModalOpen] = useState(false);
    const [selectedLetter, setSelectedLetter] = useState(null);
    const [search, setSearch] = useState(filters.search || '');
    const [followupFilter, setFollowupFilter] = useState(filters.followup_status || '');
    const [directionFilter, setDirectionFilter] = useState(filters.direction || '');

    const handleFilterChange = (newFilters = {}) => {
        router.get(
            route('letters.external'),
            {
                search: newFilters.search !== undefined ? newFilters.search : search,
                followup_status: newFilters.followup_status !== undefined ? newFilters.followup_status : followupFilter,
                direction: newFilters.direction !== undefined ? newFilters.direction : directionFilter,
            },
            { preserveState: true, replace: true }
        );
    };

    const handleDelete = (letter) => {
        if (confirm(`Hapus surat eksternal nomor ${letter.letter_number}?`)) {
            router.delete(route('letters.destroy', letter.id));
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 leading-tight">Surat Eksternal & Audit Follow-Up</h2>
                        <p className="text-xs text-gray-500 mt-0.5">Pelacakan korespondensi pihak eksternal, audit komite, dan pemantauan tindak lanjut</p>
                    </div>
                    <button
                        onClick={() => { setSelectedLetter(null); setIsLetterModalOpen(true); }}
                        className="inline-flex items-center rounded-lg bg-[#194f2b] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#123b20]"
                    >
                        <Plus className="me-1.5 h-4 w-4" />
                        Catat Surat Eksternal
                    </button>
                </div>
            }
        >
            <Head title="Surat Eksternal & Follow-Up - SPI PT BSP" />

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
                            placeholder="Cari perihal, nomor surat, instansi..."
                            className="w-full pl-9 rounded-lg border-gray-300 text-sm focus:border-emerald-600 focus:ring-emerald-600"
                        />
                    </div>
                    <div>
                        <select
                            value={followupFilter}
                            onChange={(e) => { setFollowupFilter(e.target.value); handleFilterChange({ followup_status: e.target.value }); }}
                            className="w-full rounded-lg border-gray-300 text-sm focus:border-emerald-600 focus:ring-emerald-600"
                        >
                            <option value="">Semua Status Follow-Up</option>
                            <option value="pending">Belum Tindak Lanjut</option>
                            <option value="in_progress">Dalam Proses</option>
                            <option value="completed">Selesai</option>
                            <option value="not_required">Tidak Perlu</option>
                        </select>
                    </div>
                    <div>
                        <select
                            value={directionFilter}
                            onChange={(e) => { setDirectionFilter(e.target.value); handleFilterChange({ direction: e.target.value }); }}
                            className="w-full rounded-lg border-gray-300 text-sm focus:border-emerald-600 focus:ring-emerald-600"
                        >
                            <option value="">Semua Arah (Masuk/Keluar)</option>
                            <option value="incoming">Surat Masuk</option>
                            <option value="outgoing">Surat Keluar</option>
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
                                <th className="px-6 py-3.5">Nomor & Arah</th>
                                <th className="px-6 py-3.5">Perihal & Instansi</th>
                                <th className="px-6 py-3.5">Tanggal & Tenggat</th>
                                <th className="px-6 py-3.5">Status Follow-Up</th>
                                <th className="px-6 py-3.5">Catatan Tindak Lanjut</th>
                                <th className="px-6 py-3.5 text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 bg-white">
                            {letters.data.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="py-12 text-center text-gray-400">
                                        <Send className="mx-auto h-8 w-8 text-gray-300 mb-2" />
                                        Belum ada surat eksternal tercatat
                                    </td>
                                </tr>
                            ) : (
                                letters.data.map((l) => (
                                    <tr key={l.id} className="hover:bg-slate-50/80 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="font-mono font-medium text-emerald-950 text-xs">{l.letter_number}</div>
                                            <div className="flex items-center mt-1 text-[11px] text-gray-500">
                                                {l.direction === 'incoming' ? (
                                                    <span className="inline-flex items-center text-blue-600"><ArrowDownLeft className="h-3 w-3 me-0.5" /> Masuk</span>
                                                ) : (
                                                    <span className="inline-flex items-center text-emerald-600"><ArrowUpRight className="h-3 w-3 me-0.5" /> Keluar</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-semibold text-gray-900 max-w-xs">{l.subject}</div>
                                            <div className="text-xs text-gray-500 mt-0.5">{l.sender} &rarr; {l.recipient}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-xs">
                                            <div className="text-gray-600">Surat: {l.letter_date}</div>
                                            {l.followup_due_date ? (
                                                <div className="mt-1 font-semibold text-red-600">Tenggat: {l.followup_due_date}</div>
                                            ) : (
                                                <div className="text-[11px] text-gray-400">Tanpa batas</div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <StatusBadge status={l.followup_status} type="followup" />
                                        </td>
                                        <td className="px-6 py-4 text-xs text-gray-600 max-w-xs">
                                            {l.followup_notes ? (
                                                <span className="line-clamp-2">{l.followup_notes}</span>
                                            ) : (
                                                <span className="text-gray-400 italic">Belum ada catatan</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <div className="inline-flex items-center space-x-1.5">
                                                <button
                                                    onClick={() => { setSelectedLetter(l); setIsFollowUpModalOpen(true); }}
                                                    className="inline-flex items-center px-2 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 rounded-lg hover:bg-emerald-100"
                                                    title="Perbarui Status Follow-Up"
                                                >
                                                    <CheckCircle2 className="h-3.5 w-3.5 me-1" />
                                                    Tindak Lanjut
                                                </button>
                                                {l.file_path && (
                                                    <a
                                                        href={route('letters.download', l.id)}
                                                        className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg"
                                                        title="Unduh Lampiran"
                                                    >
                                                        <Download className="h-4 w-4" />
                                                    </a>
                                                )}
                                                <button
                                                    onClick={() => { setSelectedLetter(l); setIsLetterModalOpen(true); }}
                                                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"
                                                    title="Ubah Surat"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(l)}
                                                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
                                                    title="Hapus Surat"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                <Pagination links={letters.links} />
            </div>

            {/* Modals */}
            <LetterModal
                isOpen={isLetterModalOpen}
                onClose={() => setIsLetterModalOpen(false)}
                letter={selectedLetter}
                defaultScope="external"
            />

            <FollowUpModal
                isOpen={isFollowUpModalOpen}
                onClose={() => setIsFollowUpModalOpen(false)}
                letter={selectedLetter}
            />
        </AuthenticatedLayout>
    );
}
