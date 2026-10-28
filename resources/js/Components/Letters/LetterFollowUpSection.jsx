import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';

export default function LetterFollowUpSection({ data, setData }) {
    if (data.scope !== 'external') return null;

    return (
        <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-blue-900">
                Pelacakan Tindak Lanjut (Follow-Up Eksternal)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <InputLabel htmlFor="followup_status" value="Status Follow-Up" />
                    <select
                        id="followup_status"
                        value={data.followup_status}
                        onChange={(e) => setData('followup_status', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-600 focus:ring-emerald-600 sm:text-sm"
                    >
                        <option value="pending">Belum Tindak Lanjut</option>
                        <option value="in_progress">Dalam Proses</option>
                        <option value="completed">Selesai</option>
                        <option value="not_required">Tidak Perlu</option>
                    </select>
                </div>
                <div>
                    <InputLabel htmlFor="followup_due_date" value="Tenggat Waktu Follow-Up" />
                    <TextInput
                        id="followup_due_date"
                        type="date"
                        value={data.followup_due_date}
                        className="mt-1 block w-full"
                        onChange={(e) => setData('followup_due_date', e.target.value)}
                    />
                </div>
            </div>
        </div>
    );
}
