import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import StatusBadge from '@/Components/StatusBadge';
import Pagination from '@/Components/Pagination';
import LetterModal from '@/Components/Letters/LetterModal';
import { Plus, Search, Download, Edit, Trash2, Mail, ArrowDownLeft, ArrowUpRight } from 'lucide-react';

export default function Internal({ letters, filters }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedLetter, setSelectedLetter] = useState(null);
    const [search, setSearch] = useState(filters.search || '');
    const [directionFilter, setDirectionFilter] = useState(filters.direction || '');
    const [confidentialityFilter, setConfidentialityFilter] = useState(filters.confidentiality || '');

    const handleFilterChange = (newFilters = {}) => {
        router.get(
            route('letters.internal'),
            {
                search: newFilters.search !== undefined ? newFilters.search : search,
                direction: newFilters.direction !== undefined ? newFilters.direction : directionFilter,
                confidentiality: newFilters.confidentiality !== undefined ? newFilters.confidentiality : confidentialityFilter,
            },
            { preserveState: true, replace: true }
        );
    };

    const handleDelete = (letter) => {
        if (confirm(`Hapus surat nomor ${letter.letter_number}?`)) {
            router.delete(route('letters.destroy', letter.id));
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 leading-tight">Surat Internal SPI</h2>
                        <p className="text-xs text-gray-500 mt-0.5">Pencatatan korespondensi surat masuk & keluar antar departemen internal PT BSP</p>
                    </div>
                    <button
                        onClick={() => { setSelectedLetter(null); setIsModalOpen(true); }}
                        className="inline-flex items-center rounded-lg bg-[#194f2b] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#123b20]"
                    >
                        <Plus className="me-1.5 h-4 w-4" />
                        Catat Surat Internal
                    </button>
                </div>
            }
        >
            <Head title="Surat Internal - SPI PT BSP" />

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
                            placeholder="Cari perihal, nomor surat, pengirim, atau penerima..."
                            className="w-full pl-9 rounded-lg border-gray-300 text-sm focus:border-emerald-600 focus:ring-emerald-600"
                        />
                    </div>
                    <div>
                        <select
                            value={directionFilter}
                            onChange={(e) => { setDirectionFilter(e.target.value); handleFilterChange({ direction: e.target.value }); }}
                            className="w-full rounded-lg border-gray-300 text-sm focus:border-emerald-600 focus:ring-emerald-600"
                        >
                            <option value="">Semua Arah (Masuk & Keluar)</option>
                            <option value="incoming">Surat Masuk</option>
                            <option value="outgoing">Surat Keluar</option>
                        </select>
                    </div>
                    <div>
                        <select
                            value={confidentialityFilter}
                            onChange={(e) => { setConfidentialityFilter(e.target.value); handleFilterChange({ confidentiality: e.target.value }); }}
                            className="w-full rounded-lg border-gray-300 text-sm focus:border-emerald-600 focus:ring-emerald-600"
                        >
                            <option value="">Semua Kerahasiaan</option>
                            <option value="Biasa">Biasa</option>
                            <option value="Terbatas">Terbatas</option>
                            <option value="Rahasia">Rahasia</option>
                            <option value="Sangat Rahasia">Sangat Rahasia</option>
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
                                <th className="px-6 py-3.5">Perihal Surat</th>
                                <th className="px-6 py-3.5">Pengirim & Tujuan</th>
                                <th className="px-6 py-3.5">Tanggal</th>
                                <th className="px-6 py-3.5">Kerahasiaan</th>
                                <th className="px-6 py-3.5 text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 bg-white">
                            {letters.data.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="py-12 text-center text-gray-400">
                                        <Mail className="mx-auto h-8 w-8 text-gray-300 mb-2" />
                                        Belum ada surat internal tercatat
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
                                                {l.agenda_number && <span className="ms-2 text-gray-400">Agd: {l.agenda_number}</span>}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-semibold text-gray-900 max-w-xs">{l.subject}</div>
                                            {l.letter_type_code && <span className="text-[10px] font-mono bg-slate-100 text-gray-600 px-1 rounded">{l.letter_type_code}</span>}
                                        </td>
                                        <td className="px-6 py-4 text-xs">
                                            <div><span className="text-gray-400">Dari:</span> <span className="font-medium text-gray-800">{l.sender}</span></div>
                                            <div className="mt-0.5"><span className="text-gray-400">Kepada:</span> <span className="font-medium text-gray-800">{l.recipient}</span></div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-600">
                                            <div>{l.letter_date}</div>
                                            {l.received_date && <div className="text-[11px] text-gray-400">Diterima: {l.received_date}</div>}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <StatusBadge status={l.confidentiality} type="confidentiality" />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <div className="inline-flex items-center space-x-2">
                                                {l.file_path ? (
                                                    <a
                                                        href={route('letters.download', l.id)}
                                                        className="p-1.5 text-emerald-700 hover:bg-emerald-50 rounded-lg"
                                                        title="Unduh Lampiran"
                                                    >
                                                        <Download className="h-4 w-4" />
                                                    </a>
                                                ) : (
                                                    <span className="p-1.5 text-gray-300 cursor-not-allowed" title="Tanpa Lampiran">
                                                        <Download className="h-4 w-4" />
                                                    </span>
                                                )}
                                                <button
                                                    onClick={() => { setSelectedLetter(l); setIsModalOpen(true); }}
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

            {/* Letter Modal */}
            <LetterModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                letter={selectedLetter}
                defaultScope="internal"
            />
        </AuthenticatedLayout>
    );
}
