import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import StatusBadge from '@/Components/StatusBadge';
import Pagination from '@/Components/Pagination';
import DocumentModal from '@/Components/Documents/DocumentModal';
import { Plus, Search, Download, Edit, Trash2, FileText, Filter, AlertTriangle } from 'lucide-react';

export default function Index({ documents, departments, filters }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDoc, setSelectedDoc] = useState(null);
    const [search, setSearch] = useState(filters.search || '');
    const [deptFilter, setDeptFilter] = useState(filters.department_id || '');
    const [typeFilter, setTypeFilter] = useState(filters.document_type || '');

    const activeTab = filters.tab || 'active';

    const handleFilterChange = (newFilters = {}) => {
        router.get(
            route('documents.index'),
            {
                tab: activeTab,
                search: newFilters.search !== undefined ? newFilters.search : search,
                department_id: newFilters.department_id !== undefined ? newFilters.department_id : deptFilter,
                document_type: newFilters.document_type !== undefined ? newFilters.document_type : typeFilter,
            },
            { preserveState: true, replace: true }
        );
    };

    const handleTabChange = (tabName) => {
        router.get(route('documents.index'), { ...filters, tab: tabName }, { preserveState: true });
    };

    const handleDelete = (doc) => {
        if (confirm(`Yakin ingin menghapus dokumen ${doc.document_number} ke arsip sampah?`)) {
            router.delete(route('documents.destroy', doc.id));
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 leading-tight">Dokumen Master SOP & Pedoman</h2>
                        <p className="text-xs text-gray-500 mt-0.5">Lemari digital manual, SOP, work instruction, dan formulir terstandarisasi PT BSP</p>
                    </div>
                    <button
                        onClick={() => { setSelectedDoc(null); setIsModalOpen(true); }}
                        className="inline-flex items-center rounded-lg bg-[#194f2b] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#123b20]"
                    >
                        <Plus className="me-1.5 h-4 w-4" />
                        Tambah Dokumen
                    </button>
                </div>
            }
        >
            <Head title="Dokumen Master SOP - SPI PT BSP" />

            {/* Tabs */}
            <div className="border-b border-gray-200 mb-6 bg-white rounded-t-xl px-4 pt-2 shadow-sm">
                <nav className="flex space-x-6">
                    <button
                        onClick={() => handleTabChange('active')}
                        className={`py-3 px-1 border-b-2 text-sm font-semibold transition-colors ${
                            activeTab === 'active' ? 'border-emerald-700 text-emerald-800' : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        Dokumen Terkendali (Aktif)
                    </button>
                    <button
                        onClick={() => handleTabChange('expired')}
                        className={`py-3 px-1 border-b-2 text-sm font-semibold transition-colors ${
                            activeTab === 'expired' ? 'border-red-600 text-red-700' : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        Arsip Kadaluarsa (Retensi 3 Thn)
                    </button>
                    <button
                        onClick={() => handleTabChange('all')}
                        className={`py-3 px-1 border-b-2 text-sm font-semibold transition-colors ${
                            activeTab === 'all' ? 'border-gray-800 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        Seluruh Dokumen
                    </button>
                </nav>
            </div>

            {/* Filters Card */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <div className="relative sm:col-span-2">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleFilterChange({ search })}
                            placeholder="Cari nomor dokumen atau judul..."
                            className="w-full pl-9 rounded-lg border-gray-300 text-sm focus:border-emerald-600 focus:ring-emerald-600"
                        />
                    </div>
                    <div>
                        <select
                            value={deptFilter}
                            onChange={(e) => { setDeptFilter(e.target.value); handleFilterChange({ department_id: e.target.value }); }}
                            className="w-full rounded-lg border-gray-300 text-sm focus:border-emerald-600 focus:ring-emerald-600"
                        >
                            <option value="">Semua Departemen</option>
                            {departments.map((d) => (
                                <option key={d.id} value={d.id}>{d.code} - {d.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <select
                            value={typeFilter}
                            onChange={(e) => { setTypeFilter(e.target.value); handleFilterChange({ document_type: e.target.value }); }}
                            className="w-full rounded-lg border-gray-300 text-sm focus:border-emerald-600 focus:ring-emerald-600"
                        >
                            <option value="">Semua Tipe (SOP/WI/MAN/FORM)</option>
                            <option value="SOP">SOP</option>
                            <option value="MAN">MAN</option>
                            <option value="WI">WI</option>
                            <option value="FORM">FORM</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
                        <thead className="bg-slate-50 text-xs uppercase font-semibold text-gray-600">
                            <tr>
                                <th className="px-6 py-3.5">Nomor & Versi</th>
                                <th className="px-6 py-3.5">Judul Dokumen</th>
                                <th className="px-6 py-3.5">Departemen & Tipe</th>
                                <th className="px-6 py-3.5">Kerahasiaan</th>
                                <th className="px-6 py-3.5">Status</th>
                                <th className="px-6 py-3.5 text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 bg-white">
                            {documents.data.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="py-12 text-center text-gray-400">
                                        <FileText className="mx-auto h-8 w-8 text-gray-300 mb-2" />
                                        Belum ada dokumen master tercatat
                                    </td>
                                </tr>
                            ) : (
                                documents.data.map((doc) => (
                                    <tr key={doc.id} className="hover:bg-slate-50/80 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap font-mono font-medium text-emerald-950">
                                            {doc.document_number}
                                            <span className="ms-2 inline-block rounded bg-slate-100 px-1.5 py-0.5 text-[11px] font-sans text-gray-600">
                                                v{doc.version}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-semibold text-gray-900">{doc.title}</div>
                                            <div className="text-xs text-gray-400 mt-0.5">TMT: {doc.effective_date}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="font-semibold text-gray-700">{doc.department?.code}</span>
                                            <span className="ms-1.5 text-xs text-gray-500">({doc.document_type})</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <StatusBadge status={doc.confidentiality} type="confidentiality" />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <StatusBadge status={doc.control_status} type="control_status" />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <div className="inline-flex items-center space-x-2">
                                                <a
                                                    href={route('documents.download', doc.id)}
                                                    className="p-1.5 text-emerald-700 hover:bg-emerald-50 rounded-lg"
                                                    title="Unduh Dokumen"
                                                >
                                                    <Download className="h-4 w-4" />
                                                </a>
                                                <button
                                                    onClick={() => { setSelectedDoc(doc); setIsModalOpen(true); }}
                                                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"
                                                    title="Ubah Dokumen"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(doc)}
                                                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
                                                    title="Hapus Dokumen"
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
                <Pagination links={documents.links} />
            </div>

            {/* Document Modal */}
            <DocumentModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                document={selectedDoc}
                departments={departments}
            />
        </AuthenticatedLayout>
    );
}
