import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import { Shield, Save, CheckCircle2, RotateCcw } from 'lucide-react';

const MODULE_CONFIG = [
    { id: 'sop', title: 'Dokumen Master SOP & Pedoman', read: 'read_sop', create: 'create_sop', update: 'update_sop', delete: 'delete_sop' },
    { id: 'letters_internal', title: 'Surat Internal', read: 'read_letters_internal', create: 'create_letters_internal', update: 'update_letters_internal', delete: 'delete_letters_internal' },
    { id: 'letters_external', title: 'Surat Eksternal & Tindak Lanjut', read: 'read_letters_external', create: 'create_letters_external', update: 'update_letters_external', delete: 'delete_letters_external' },
    { id: 'letters_approval', title: 'Persetujuan Surat Keluar (Approval)', approve: 'approve_letter' },
    { id: 'dispositions', title: 'Lembar Disposisi Digital', read: 'read_disposition', create: 'create_disposition', update: 'update_disposition', delete: 'delete_disposition' },
    { id: 'meetings', title: 'Jadwal Rapat & E-Notulen', read: 'read_meeting', create: 'create_meeting', update: 'update_meeting', delete: 'delete_meeting' },
    { id: 'kpis', title: 'Indikator Kinerja Kunci (KPI)', read: 'read_kpi', create: 'create_kpi', update: 'update_kpi', delete: 'delete_kpi' },
];

export default function PermissionCrudMatrix({ user, allPermissions = [] }) {
    const isSuperAdmin = user?.role === 'super_admin';
    const [selectedIds, setSelectedIds] = useState([]);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (user && user.permissions) {
            setSelectedIds(user.permissions.map((p) => p.id));
        } else {
            setSelectedIds([]);
        }
    }, [user]);

    const permMap = allPermissions.reduce((acc, p) => {
        acc[p.name] = p.id;
        return acc;
    }, {});

    const isChecked = (name) => {
        const id = permMap[name];
        return id ? selectedIds.includes(id) : false;
    };

    const toggle = (name) => {
        const id = permMap[name];
        if (!id) return;
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    const toggleRow = (mod) => {
        const rowKeys = [mod.read, mod.create, mod.update, mod.delete, mod.approve].filter(Boolean);
        const rowIds = rowKeys.map((k) => permMap[k]).filter(Boolean);
        const allChecked = rowIds.every((id) => selectedIds.includes(id));

        if (allChecked) {
            setSelectedIds((prev) => prev.filter((id) => !rowIds.includes(id)));
        } else {
            setSelectedIds((prev) => Array.from(new Set([...prev, ...rowIds])));
        }
    };

    const handleSelectAll = () => {
        setSelectedIds(allPermissions.map((p) => p.id));
    };

    const handleClearAll = () => {
        setSelectedIds([]);
    };

    const handleSave = () => {
        setIsSaving(true);
        router.put(
            route('permissions.update', user.id),
            { permission_ids: selectedIds },
            {
                preserveScroll: true,
                onFinish: () => setIsSaving(false),
            }
        );
    };

    const renderCheckbox = (name, label) => {
        if (!name) return <span className="text-gray-300">&mdash;</span>;
        const checked = isChecked(name);
        return (
            <label className="inline-flex items-center justify-center p-1 cursor-pointer hover:bg-emerald-50 rounded" title={label}>
                <input
                    type="checkbox"
                    checked={checked}
                    disabled={isSuperAdmin}
                    onChange={() => toggle(name)}
                    className="rounded border-gray-300 text-emerald-700 shadow-sm focus:ring-emerald-600 h-4 w-4 disabled:opacity-50"
                />
            </label>
        );
    };

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-gray-100 gap-3">
                <div>
                    <div className="flex items-center space-x-2">
                        <Shield className="h-5 w-5 text-emerald-700" />
                        <h3 className="text-base font-bold text-gray-900">Matriks Hak Akses CRUD Granular</h3>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">
                        Tentukan hak aksi per modul secara spesifik untuk <strong>{user?.name}</strong> ({user?.role})
                    </p>
                </div>

                {!isSuperAdmin && (
                    <div className="flex items-center space-x-2">
                        <button
                            type="button"
                            onClick={handleSelectAll}
                            className="text-xs text-emerald-700 font-semibold hover:bg-emerald-50 px-2.5 py-1.5 rounded-lg border border-emerald-200 transition"
                        >
                            Pilih Semua
                        </button>
                        <button
                            type="button"
                            onClick={handleClearAll}
                            className="text-xs text-gray-600 font-medium hover:bg-gray-100 px-2.5 py-1.5 rounded-lg border border-gray-200 transition"
                        >
                            Kosongkan
                        </button>
                    </div>
                )}
            </div>

            {isSuperAdmin && (
                <div className="p-3.5 rounded-xl bg-purple-50 border border-purple-200 text-xs text-purple-900">
                    Pengguna ini adalah <strong>Super Admin</strong>. Seluruh fungsi sistem diaktifkan secara otomatis tanpa batasan.
                </div>
            )}

            <div className="overflow-x-auto rounded-xl border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200 text-xs">
                    <thead className="bg-slate-50 text-gray-700 font-bold uppercase tracking-wider">
                        <tr>
                            <th className="px-4 py-3 text-left">Modul Fitur SPI</th>
                            <th className="px-3 py-3 text-center w-20">Lihat (R)</th>
                            <th className="px-3 py-3 text-center w-20">Tambah (C)</th>
                            <th className="px-3 py-3 text-center w-20">Ubah (U)</th>
                            <th className="px-3 py-3 text-center w-20">Hapus (D)</th>
                            <th className="px-4 py-3 text-center w-24">Aksi Baris</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                        {MODULE_CONFIG.map((mod) => (
                            <tr key={mod.id} className="hover:bg-slate-50/80 transition">
                                <td className="px-4 py-3 font-semibold text-gray-900">
                                    {mod.title}
                                    {mod.approve && <span className="ms-2 text-[10px] text-amber-700 font-normal bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">Hak Approval</span>}
                                </td>
                                <td className="px-3 py-3 text-center">{renderCheckbox(mod.read, 'Lihat data')}</td>
                                <td className="px-3 py-3 text-center">{renderCheckbox(mod.create, 'Tambah data baru')}</td>
                                <td className="px-3 py-3 text-center">{renderCheckbox(mod.update || mod.approve, 'Ubah / Approval data')}</td>
                                <td className="px-3 py-3 text-center">{renderCheckbox(mod.delete, 'Hapus data')}</td>
                                <td className="px-4 py-3 text-center">
                                    {!isSuperAdmin && (
                                        <button
                                            type="button"
                                            onClick={() => toggleRow(mod)}
                                            className="text-[11px] font-medium text-emerald-700 hover:text-emerald-900 hover:underline"
                                        >
                                            Toggle
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {!isSuperAdmin && (
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <span className="text-xs text-gray-500">
                        {selectedIds.length} dari {allPermissions.length} hak akses dipilih untuk pengguna ini
                    </span>
                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={isSaving}
                        className="inline-flex items-center rounded-lg bg-[#194f2b] px-5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#123b20] transition disabled:opacity-75"
                    >
                        <Save className="h-4 w-4 me-1.5" />
                        {isSaving ? 'Menyimpan Matriks...' : 'Simpan Hak Akses'}
                    </button>
                </div>
            )}
        </div>
    );
}

