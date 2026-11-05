import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import Pagination from '@/Components/Pagination';
import MeetingRoomModal from '@/Components/MasterData/MeetingRoomModal';
import { Plus, Search, Edit, Trash2, DoorClosed, Users } from 'lucide-react';

export default function Index({ meetingRooms, filters }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (e) => {
        if (e.key === 'Enter') {
            router.get(
                route('meeting-rooms.index'),
                { search },
                { preserveState: true, replace: true }
            );
        }
    };

    const handleDelete = (room) => {
        if (confirm(`Yakin ingin menghapus master ruangan '${room.name}'?`)) {
            router.delete(route('meeting-rooms.destroy', room.id));
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 leading-tight">Master Ruangan Rapat</h2>
                        <p className="text-xs text-gray-500 mt-0.5">Kelola daftar lokasi/ruangan rapat fisik SPI PT Bumi Siak Pusako</p>
                    </div>
                    <button
                        onClick={() => { setSelectedRoom(null); setIsModalOpen(true); }}
                        className="inline-flex items-center rounded-lg bg-[#194f2b] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#123b20]"
                    >
                        <Plus className="me-1.5 h-4 w-4" />
                        Tambah Ruangan
                    </button>
                </div>
            }
        >
            <Head title="Master Ruangan Rapat - SPI PT BSP" />

            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={handleSearch}
                        placeholder="Cari nama ruangan rapat..."
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
                                <th className="px-6 py-3.5">Nama Ruangan Rapat</th>
                                <th className="px-6 py-3.5 text-center">Kapasitas</th>
                                <th className="px-6 py-3.5">Terdaftar</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 bg-white">
                            {meetingRooms.data.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="py-12 text-center text-gray-400">
                                        <DoorClosed className="mx-auto h-8 w-8 text-gray-300 mb-2" />
                                        Belum ada data ruangan rapat tercatat
                                    </td>
                                </tr>
                            ) : (
                                meetingRooms.data.map((room) => (
                                    <tr key={room.id} className="hover:bg-slate-50/80 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <div className="inline-flex items-center space-x-1.5">
                                                <button
                                                    onClick={() => { setSelectedRoom(room); setIsModalOpen(true); }}
                                                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"
                                                    title="Ubah Ruangan"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(room)}
                                                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
                                                    title="Hapus Ruangan"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-bold text-gray-900 whitespace-nowrap">
                                            <div className="flex items-center space-x-2">
                                                <DoorClosed className="w-4 h-4 text-emerald-600 shrink-0" />
                                                <span>{room.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            {room.capacity ? (
                                                <span className="inline-flex items-center text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                                                    <Users className="w-3 h-3 me-1 text-emerald-600" />
                                                    {room.capacity} Orang
                                                </span>
                                            ) : (
                                                <span className="text-xs text-gray-400 italic">Tidak ditentukan</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                                            {new Date(room.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                <Pagination links={meetingRooms.links} />
            </div>

            <MeetingRoomModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                meetingRoom={selectedRoom}
            />
        </AuthenticatedLayout>
    );
}

