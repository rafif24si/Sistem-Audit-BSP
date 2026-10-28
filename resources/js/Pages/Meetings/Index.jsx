import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import StatusBadge from '@/Components/StatusBadge';
import Pagination from '@/Components/Pagination';
import MeetingModal from '@/Components/Meetings/MeetingModal';
import { Plus, Search, Calendar, MapPin, Users, FileText, Download, Edit, Trash2 } from 'lucide-react';

export default function Index({ meetings, allUsers, filters }) {
    const { user } = usePage().props.auth;
    const canManage = ['super_admin', 'manager_spi'].includes(user?.role);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedMeeting, setSelectedMeeting] = useState(null);
    const [search, setSearch] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || '');
    const [typeFilter, setTypeFilter] = useState(filters.meeting_type || '');

    const handleFilterChange = (newFilters = {}) => {
        router.get(
            route('meetings.index'),
            {
                search: newFilters.search !== undefined ? newFilters.search : search,
                status: newFilters.status !== undefined ? newFilters.status : statusFilter,
                meeting_type: newFilters.meeting_type !== undefined ? newFilters.meeting_type : typeFilter,
            },
            { preserveState: true, replace: true }
        );
    };

    const handleDelete = (meeting) => {
        if (confirm(`Yakin ingin membatalkan dan menghapus rapat '${meeting.title}'?`)) {
            router.delete(route('meetings.destroy', meeting.id));
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 leading-tight">Jadwal Rapat & E-Notulen</h2>
                        <p className="text-xs text-gray-500 mt-0.5">Pengelolaan agenda rapat audit (Entry/Exit Meeting) dan pencatatan notulen digital</p>
                    </div>
                    {canManage && (
                        <button
                            onClick={() => { setSelectedMeeting(null); setIsModalOpen(true); }}
                            className="inline-flex items-center rounded-lg bg-[#194f2b] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#123b20]"
                        >
                            <Plus className="me-1.5 h-4 w-4" />
                            Jadwalkan Rapat
                        </button>
                    )}
                </div>
            }
        >
            <Head title="Jadwal Rapat & E-Notulen - SPI PT BSP" />

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
                            placeholder="Cari agenda rapat, lokasi, atau notulen..."
                            className="w-full pl-9 rounded-lg border-gray-300 text-sm focus:border-emerald-600 focus:ring-emerald-600"
                        />
                    </div>
                    <div>
                        <select
                            value={statusFilter}
                            onChange={(e) => { setStatusFilter(e.target.value); handleFilterChange({ status: e.target.value }); }}
                            className="w-full rounded-lg border-gray-300 text-sm focus:border-emerald-600 focus:ring-emerald-600"
                        >
                            <option value="">Semua Status Rapat</option>
                            <option value="Terjadwal">Terjadwal</option>
                            <option value="Berlangsung">Berlangsung</option>
                            <option value="Selesai">Selesai</option>
                            <option value="Dibatalkan">Dibatalkan</option>
                        </select>
                    </div>
                    <div>
                        <select
                            value={typeFilter}
                            onChange={(e) => { setTypeFilter(e.target.value); handleFilterChange({ meeting_type: e.target.value }); }}
                            className="w-full rounded-lg border-gray-300 text-sm focus:border-emerald-600 focus:ring-emerald-600"
                        >
                            <option value="">Semua Jenis Rapat</option>
                            <option value="Entry Meeting">Entry Meeting</option>
                            <option value="Exit Meeting">Exit Meeting</option>
                            <option value="Rapat Internal SPI">Rapat Internal SPI</option>
                            <option value="Rapat Pimpinan">Rapat Pimpinan</option>
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
                                <th className="px-6 py-3.5">Agenda & Jenis Rapat</th>
                                <th className="px-6 py-3.5">Tanggal & Waktu</th>
                                <th className="px-6 py-3.5">Lokasi & Undangan</th>
                                <th className="px-6 py-3.5">Kerahasiaan</th>
                                <th className="px-6 py-3.5">Status</th>
                                <th className="px-6 py-3.5 text-center">Aksi & Notulen</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 bg-white">
                            {meetings.data.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="py-12 text-center text-gray-400">
                                        <Calendar className="mx-auto h-8 w-8 text-gray-300 mb-2" />
                                        Belum ada jadwal rapat audit tercatat
                                    </td>
                                </tr>
                            ) : (
                                meetings.data.map((m) => {
                                    const inviteesList = Array.isArray(m.invitees) ? m.invitees : [];
                                    return (
                                        <tr key={m.id} className="hover:bg-slate-50/80 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-gray-900 text-sm max-w-xs">{m.title}</div>
                                                <span className="inline-block mt-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                                    {m.meeting_type}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-600">
                                                <div className="font-semibold text-gray-800">{m.meeting_date}</div>
                                                <div className="mt-0.5 text-gray-500">{m.start_time} - {m.end_time || 'Selesai'} WIB</div>
                                            </td>
                                            <td className="px-6 py-4 text-xs">
                                                <div className="flex items-center text-gray-700">
                                                    <MapPin className="h-3.5 w-3.5 me-1 text-gray-400 shrink-0" />
                                                    <span className="truncate max-w-xs">{m.location}</span>
                                                </div>
                                                <div className="flex items-center text-gray-500 mt-1">
                                                    <Users className="h-3.5 w-3.5 me-1 text-gray-400 shrink-0" />
                                                    <span>{inviteesList.length} Peserta Undangan</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <StatusBadge status={m.confidentiality} type="confidentiality" />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <StatusBadge status={m.status} type="meeting_status" />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <div className="inline-flex items-center space-x-1.5">
                                                    <Link
                                                        href={route('meetings.show', m.id)}
                                                        className="inline-flex items-center px-2.5 py-1 text-xs font-semibold text-white bg-emerald-700 rounded-lg hover:bg-emerald-800 shadow-2xs"
                                                        title="Buka / Catat E-Notulen"
                                                    >
                                                        <FileText className="h-3.5 w-3.5 me-1" />
                                                        E-Notulen
                                                    </Link>
                                                    {m.attachment_path && (
                                                        <a
                                                            href={route('meetings.download', m.id)}
                                                            className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg"
                                                            title="Unduh Berkas Lampiran"
                                                        >
                                                            <Download className="h-4 w-4" />
                                                        </a>
                                                    )}
                                                    {canManage && (
                                                        <>
                                                            <button
                                                                onClick={() => { setSelectedMeeting(m); setIsModalOpen(true); }}
                                                                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"
                                                                title="Ubah Rapat"
                                                            >
                                                                <Edit className="h-4 w-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(m)}
                                                                className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
                                                                title="Hapus Rapat"
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
                <Pagination links={meetings.links} />
            </div>

            {/* Meeting Modal */}
            <MeetingModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                meeting={selectedMeeting}
                allUsers={allUsers}
            />
        </AuthenticatedLayout>
    );
}
