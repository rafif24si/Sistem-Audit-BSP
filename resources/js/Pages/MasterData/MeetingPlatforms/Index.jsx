import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import Pagination from '@/Components/Pagination';
import MeetingPlatformModal from '@/Components/MasterData/MeetingPlatformModal';
import { Plus, Search, Edit, Trash2, Video, CheckCircle2, XCircle } from 'lucide-react';

export default function Index({ meetingPlatforms, filters }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPlatform, setSelectedPlatform] = useState(null);
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (e) => {
        if (e.key === 'Enter') {
            router.get(
                route('meeting-platforms.index'),
                { search },
                { preserveState: true, replace: true }
            );
        }
    };

    const handleDelete = (platform) => {
        if (confirm(`Yakin ingin menghapus master platform '${platform.name}'?`)) {
            router.delete(route('meeting-platforms.destroy', platform.id));
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 leading-tight">Master Platform Meeting Online</h2>
                        <p className="text-xs text-gray-500 mt-0.5">Kelola daftar opsi platform telekonferensi virtual SPI PT Bumi Siak Pusako</p>
                    </div>
                    <button
                        onClick={() => { setSelectedPlatform(null); setIsModalOpen(true); }}
                        className="inline-flex items-center rounded-lg bg-[#194f2b] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#123b20]"
                    >
                        <Plus className="me-1.5 h-4 w-4" />
                        Tambah Platform
                    </button>
                </div>
            }
        >
            <Head title="Master Platform Rapat - SPI PT BSP" />

            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={handleSearch}
                        placeholder="Cari nama platform online..."
                        className="w-full pl-9 rounded-lg border-gray-300 text-sm focus:border-emerald-600 focus:ring-emerald-600"
                    />
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
                        <thead className="bg-slate-50 text-xs uppercase font-semibold text-gray-600">
                            <tr>
                                <th className="px-6 py-3.5 text-center w-28">Aksi</th>
                                <th className="px-6 py-3.5">Nama Platform Meeting</th>
                                <th className="px-6 py-3.5 text-center w-36">Status</th>
                                <th className="px-6 py-3.5">Terdaftar</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 bg-white">
                            {meetingPlatforms.data.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="py-12 text-center text-gray-400">
                                        <Video className="mx-auto h-8 w-8 text-gray-300 mb-2" />
                                        Belum ada platform meeting online tercatat
                                    </td>
                                </tr>
                            ) : (
                                meetingPlatforms.data.map((platform) => (
                                    <tr key={platform.id} className="hover:bg-slate-50/80 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <div className="inline-flex items-center space-x-1.5">
                                                <button
                                                    onClick={() => { setSelectedPlatform(platform); setIsModalOpen(true); }}
                                                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"
                                                    title="Ubah Platform"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(platform)}
                                                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
                                                    title="Hapus Platform"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="font-semibold text-gray-900 flex items-center space-x-2">
                                                <Video className="h-4 w-4 text-emerald-600" />
                                                <span>{platform.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            {platform.is_active ? (
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                                                    <CheckCircle2 className="h-3.5 w-3.5 me-1 text-emerald-600" />
                                                    Aktif
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">
                                                    <XCircle className="h-3.5 w-3.5 me-1 text-gray-500" />
                                                    Nonaktif
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                                            {new Date(platform.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                <Pagination links={meetingPlatforms.links} />
            </div>

            <MeetingPlatformModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                meetingPlatform={selectedPlatform}
            />
        </AuthenticatedLayout>
    );
}

