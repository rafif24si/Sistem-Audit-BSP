import { useState } from 'react';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';

export default function MeetingInviteesSection({ allUsers = [], invitees = [], addInvitee, removeInvitee, error }) {
    const [customInvitee, setCustomInvitee] = useState('');

    const handleAddCustom = (e) => {
        e.preventDefault();
        if (customInvitee.trim()) {
            addInvitee(customInvitee.trim());
            setCustomInvitee('');
        }
    };

    return (
        <div className="rounded-xl border border-gray-200 bg-slate-50/80 p-4 space-y-3">
            <InputLabel value="Daftar Undangan / Peserta Rapat" />
            <div className="flex gap-2">
                <select
                    onChange={(e) => {
                        if (e.target.value) {
                            addInvitee(e.target.value);
                            e.target.value = '';
                        }
                    }}
                    className="flex-1 rounded-md border-gray-300 shadow-sm text-xs focus:border-emerald-600 focus:ring-emerald-600"
                >
                    <option value="">Pilih dari Pengguna Sistem PT BSP...</option>
                    {allUsers.map((u) => (
                        <option key={u.id} value={u.name}>
                            {u.name} ({u.role.toUpperCase()} - {u.department?.code || 'BSP'})
                        </option>
                    ))}
                </select>
                <input
                    type="text"
                    placeholder="Atau ketik nama/eksternal..."
                    value={customInvitee}
                    onChange={(e) => setCustomInvitee(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') handleAddCustom(e);
                    }}
                    className="rounded-md border-gray-300 shadow-sm text-xs w-48"
                />
                <button
                    type="button"
                    onClick={handleAddCustom}
                    className="rounded-md bg-emerald-700 px-3 py-1.5 text-xs text-white hover:bg-emerald-800"
                >
                    Tambah
                </button>
            </div>

            <div className="flex flex-wrap gap-1.5 mt-2 max-h-24 overflow-y-auto">
                {invitees.map((inv, idx) => (
                    <span
                        key={idx}
                        className="inline-flex items-center rounded-full bg-white px-2.5 py-1 text-xs font-medium text-gray-800 border border-gray-200 shadow-2xs"
                    >
                        {inv}
                        <button
                            type="button"
                            onClick={() => removeInvitee(idx)}
                            className="ms-1.5 text-gray-400 hover:text-red-600"
                        >
                            &times;
                        </button>
                    </span>
                ))}
            </div>
            <InputError message={error} className="mt-1" />
        </div>
    );
}
