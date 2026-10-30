import { useState } from 'react';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import { Mail, Plus, X, UserCheck } from 'lucide-react';

export default function MeetingInviteesSection({
    allUsers = [],
    invitees = [],
    addInvitee,
    removeInvitee,
    error,
}) {
    const [inputVal, setInputVal] = useState('');
    const [inputError, setInputError] = useState('');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const commitEmail = (raw) => {
        const clean = raw.trim().replace(/,/g, '');
        if (!clean) return;

        if (!emailRegex.test(clean)) {
            setInputError(`'${clean}' bukan format email valid`);
            return;
        }

        if (invitees.includes(clean)) {
            setInputError(`'${clean}' sudah ditambahkan`);
            return;
        }

        addInvitee(clean);
        setInputVal('');
        setInputError('');
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ' ' || e.key === ',') {
            e.preventDefault();
            commitEmail(inputVal);
        } else if (e.key === 'Backspace' && !inputVal && invitees.length > 0) {
            removeInvitee(invitees.length - 1);
        }
    };

    return (
        <div className="rounded-xl border border-gray-200 bg-slate-50/80 p-4 space-y-3">
            <div className="flex items-center justify-between">
                <InputLabel value="Daftar Undangan / Email Peserta Rapat" />
                <span className="text-[11px] font-medium text-gray-500">
                    {invitees.length} Peserta Terdaftar
                </span>
            </div>

            {/* Dynamic Tag Input Box */}
            <div className="relative">
                <div className="flex min-h-[44px] flex-wrap items-center gap-1.5 rounded-lg border border-gray-300 bg-white p-2 shadow-2xs focus-within:border-emerald-600 focus-within:ring-1 focus-within:ring-emerald-600">
                    {invitees.map((email, idx) => (
                        <span
                            key={idx}
                            className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-900 border border-emerald-200 transition-all"
                        >
                            <Mail className="h-3 w-3 text-emerald-600" />
                            <span>{email}</span>
                            <button
                                type="button"
                                onClick={() => removeInvitee(idx)}
                                className="rounded-full p-0.5 text-emerald-600 hover:bg-emerald-200/60 hover:text-emerald-950 focus:outline-none"
                                title="Hapus email"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </span>
                    ))}

                    <input
                        type="email"
                        value={inputVal}
                        onChange={(e) => {
                            setInputVal(e.target.value);
                            if (inputError) setInputError('');
                        }}
                        onKeyDown={handleKeyDown}
                        onBlur={() => {
                            if (inputVal.trim()) commitEmail(inputVal);
                        }}
                        placeholder={
                            invitees.length === 0
                                ? 'Ketik email peserta lalu tekan Enter atau Spasi...'
                                : 'Tambah email lagi...'
                        }
                        className="flex-1 min-w-[200px] border-0 p-1 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-0"
                    />

                    {inputVal.trim() && (
                        <button
                            type="button"
                            onClick={() => commitEmail(inputVal)}
                            className="inline-flex items-center gap-1 rounded-md bg-emerald-700 px-2.5 py-1 text-xs font-medium text-white shadow-xs hover:bg-emerald-800 transition"
                        >
                            <Plus className="h-3 w-3" />
                            <span>Tambah</span>
                        </button>
                    )}
                </div>

                <p className="mt-1 text-[11px] text-gray-500">
                    Ketik alamat email bebas (internal atau eksternal), tekan <kbd className="rounded border bg-white px-1 font-mono text-[10px] text-gray-600">Enter</kbd> atau <kbd className="rounded border bg-white px-1 font-mono text-[10px] text-gray-600">Spasi</kbd> untuk membuat chip.
                </p>

                {inputError && (
                    <p className="mt-1 text-xs text-red-600 font-medium">
                        {inputError}
                    </p>
                )}
            </div>

            {/* Quick-Add Internal User Email Dropdown */}
            {allUsers && allUsers.length > 0 && (
                <div className="pt-1 border-t border-gray-200/80">
                    <div className="flex items-center gap-2">
                        <UserCheck className="h-3.5 w-3.5 text-gray-400" />
                        <span className="text-[11px] font-semibold text-gray-600">
                            Pilih Cepat Pengguna Internal PT BSP:
                        </span>
                        <select
                            onChange={(e) => {
                                if (e.target.value) {
                                    commitEmail(e.target.value);
                                    e.target.value = '';
                                }
                            }}
                            className="flex-1 rounded-md border-gray-300 py-1 px-2 text-xs text-gray-700 shadow-2xs focus:border-emerald-600 focus:ring-emerald-600"
                        >
                            <option value="">-- Tambah dari akun terdaftar --</option>
                            {allUsers
                                .filter((u) => u.email && !invitees.includes(u.email))
                                .map((u) => (
                                    <option key={u.id} value={u.email}>
                                        {u.name} &lt;{u.email}&gt; ({u.department?.code || 'BSP'})
                                    </option>
                                ))}
                        </select>
                    </div>
                </div>
            )}

            <InputError message={error} className="mt-1" />
        </div>
    );
}
