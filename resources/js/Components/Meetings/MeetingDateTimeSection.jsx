import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';

export default function MeetingDateTimeSection({ data, setData, errors }) {
    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                    <InputLabel htmlFor="meeting_date" value="Tanggal Rapat" />
                    <TextInput
                        id="meeting_date"
                        type="date"
                        value={data.meeting_date}
                        className="mt-1 block w-full"
                        onChange={(e) => setData('meeting_date', e.target.value)}
                        required
                    />
                    <InputError message={errors.meeting_date} className="mt-1" />
                </div>
                <div>
                    <InputLabel htmlFor="start_time" value="Waktu Mulai" />
                    <TextInput
                        id="start_time"
                        type="time"
                        value={data.start_time}
                        className="mt-1 block w-full"
                        onChange={(e) => setData('start_time', e.target.value)}
                        required
                    />
                </div>
                <div>
                    <InputLabel htmlFor="end_time" value="Waktu Selesai (Est)" />
                    <TextInput
                        id="end_time"
                        type="time"
                        value={data.end_time}
                        className="mt-1 block w-full"
                        onChange={(e) => setData('end_time', e.target.value)}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <InputLabel htmlFor="confidentiality" value="Kerahasiaan Notulen" />
                    <select
                        id="confidentiality"
                        value={data.confidentiality}
                        onChange={(e) => setData('confidentiality', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-600 focus:ring-emerald-600 sm:text-sm"
                    >
                        <option value="Terbatas">Terbatas (Bawaan SPI)</option>
                        <option value="Biasa">Biasa</option>
                        <option value="Rahasia">Rahasia</option>
                    </select>
                </div>
                <div>
                    <InputLabel htmlFor="status" value="Status Rapat" />
                    <select
                        id="status"
                        value={data.status}
                        onChange={(e) => setData('status', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-600 focus:ring-emerald-600 sm:text-sm"
                    >
                        <option value="Terjadwal">Terjadwal</option>
                        <option value="Berlangsung">Berlangsung</option>
                        <option value="Selesai">Selesai</option>
                        <option value="Dibatalkan">Dibatalkan</option>
                    </select>
                </div>
            </div>
        </div>
    );
}
