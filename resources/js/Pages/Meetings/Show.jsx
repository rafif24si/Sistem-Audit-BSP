import { useForm, Link, Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import StatusBadge from '@/Components/StatusBadge';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import { ArrowLeft, Calendar, MapPin, Users, Download, Save, CheckCircle2, Shield } from 'lucide-react';

export default function Show({ meeting, canEditNotulen }) {
    const inviteesList = Array.isArray(meeting.invitees) ? meeting.invitees : [];

    const { data, setData, patch, processing, errors } = useForm({
        discussion_points: meeting.discussion_points || '',
        decisions: meeting.decisions || '',
        status: meeting.status || 'Berlangsung',
    });

    const submit = (e) => {
        e.preventDefault();
        patch(route('meetings.update-minutes', meeting.id));
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex items-center space-x-3">
                        <Link
                            href={route('meetings.index')}
                            className="p-2 text-gray-500 hover:text-gray-900 rounded-lg hover:bg-gray-100"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 leading-tight">Risalah E-Notulen Rapat</h2>
                            <p className="text-xs text-gray-500 mt-0.5">{meeting.meeting_type} &bull; Satuan Pengawasan Intern PT BSP</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <StatusBadge status={meeting.confidentiality} type="confidentiality" />
                        <StatusBadge status={meeting.status} type="meeting_status" />
                    </div>
                </div>
            }
        >
            <Head title={`E-Notulen: ${meeting.title} - SPI PT BSP`} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left column: Meeting Metadata & Attendees */}
                <div className="space-y-6">
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
                        <h3 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3">Informasi Agenda</h3>
                        <div>
                            <h4 className="text-sm font-bold text-gray-900">{meeting.title}</h4>
                            <p className="text-xs text-emerald-800 font-medium mt-0.5">{meeting.meeting_type}</p>
                        </div>
                        <div className="space-y-2 text-xs text-gray-600">
                            <div className="flex items-center">
                                <Calendar className="h-4 w-4 me-2 text-gray-400 shrink-0" />
                                <span>{meeting.meeting_date} ({meeting.start_time} - {meeting.end_time || 'Selesai'} WIB)</span>
                            </div>
                            <div className="flex items-center">
                                <MapPin className="h-4 w-4 me-2 text-gray-400 shrink-0" />
                                <span>{meeting.location}</span>
                            </div>
                            <div className="flex items-center">
                                <Shield className="h-4 w-4 me-2 text-gray-400 shrink-0" />
                                <span>Diselenggarakan oleh: {meeting.creator?.name || 'SPI PT BSP'}</span>
                            </div>
                        </div>
                        {meeting.attachment_path && (
                            <div className="pt-2">
                                <a
                                    href={route('meetings.download', meeting.id)}
                                    className="inline-flex w-full items-center justify-center rounded-lg bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-800 hover:bg-emerald-100 border border-emerald-200"
                                >
                                    <Download className="h-4 w-4 me-1.5" />
                                    Unduh Lampiran Materi / Absensi
                                </a>
                            </div>
                        )}
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-3">
                        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                            <div className="flex items-center space-x-2">
                                <Users className="h-4 w-4 text-emerald-600" />
                                <h3 className="text-sm font-bold text-gray-900">Peserta Rapat ({inviteesList.length})</h3>
                            </div>
                        </div>
                        <ul className="divide-y divide-gray-50 max-h-60 overflow-y-auto text-xs">
                            {inviteesList.map((attendee, idx) => (
                                <li key={idx} className="py-2 flex items-center justify-between">
                                    <span className="font-medium text-gray-800">{attendee}</span>
                                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Right column: E-Notulen Editor / Viewer */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100">
                        <div className="border-b border-gray-100 pb-4 mb-6">
                            <h3 className="text-lg font-bold text-gray-900">Catatan E-Notulen Digital</h3>
                            <p className="text-xs text-gray-500 mt-0.5">Hasil resmi musyawarah audit dan butir tindak lanjut keputusan rapat</p>
                        </div>

                        {canEditNotulen ? (
                            <form onSubmit={submit} className="space-y-6">
                                <div>
                                    <InputLabel htmlFor="discussion_points" value="Poin-Poin Pembahasan Rapat (Notulen)" />
                                    <p className="text-[11px] text-gray-400 mb-1.5">Rangkuman jalannya diskusi, tanggapan auditee, dan fakta temuan audit yang dibahas.</p>
                                    <textarea
                                        id="discussion_points"
                                        rows={8}
                                        value={data.discussion_points}
                                        placeholder="Tuliskan butir-butir pembahasan rapat di sini..."
                                        className="w-full rounded-xl border-gray-300 shadow-sm focus:border-emerald-600 focus:ring-emerald-600 text-sm leading-relaxed"
                                        onChange={(e) => setData('discussion_points', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.discussion_points} className="mt-1" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="decisions" value="Hasil Keputusan & Tindak Lanjut Rapat" />
                                    <p className="text-[11px] text-gray-400 mb-1.5">Kesepakatan final, komitmen batas waktu penyerahan data, atau rekomendasi perbaikan.</p>
                                    <textarea
                                        id="decisions"
                                        rows={6}
                                        value={data.decisions}
                                        placeholder="Tuliskan kesimpulan dan butir keputusan final di sini..."
                                        className="w-full rounded-xl border-gray-300 shadow-sm focus:border-emerald-600 focus:ring-emerald-600 text-sm leading-relaxed"
                                        onChange={(e) => setData('decisions', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.decisions} className="mt-1" />
                                </div>

                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t border-gray-100">
                                    <div className="flex items-center space-x-2">
                                        <InputLabel htmlFor="status" value="Status Rapat:" className="whitespace-nowrap" />
                                        <select
                                            id="status"
                                            value={data.status}
                                            onChange={(e) => setData('status', e.target.value)}
                                            className="rounded-lg border-gray-300 text-xs shadow-sm focus:border-emerald-600 focus:ring-emerald-600"
                                        >
                                            <option value="Berlangsung">Berlangsung</option>
                                            <option value="Selesai">Selesai (Finalkan Notulen)</option>
                                            <option value="Terjadwal">Terjadwal</option>
                                            <option value="Dibatalkan">Dibatalkan</option>
                                        </select>
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="inline-flex items-center justify-center rounded-lg bg-[#194f2b] px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#123b20] disabled:opacity-75"
                                    >
                                        <Save className="h-4 w-4 me-2" />
                                        {processing ? 'Menyimpan Notulen...' : 'Simpan E-Notulen'}
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div className="space-y-6">
                                <div>
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Poin-Poin Pembahasan:</h4>
                                    <div className="rounded-xl bg-slate-50 p-4 text-sm text-gray-800 whitespace-pre-line leading-relaxed border border-slate-200">
                                        {meeting.discussion_points || <span className="text-gray-400 italic">Belum ada catatan pembahasan yang diisi oleh tim audit.</span>}
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Hasil Keputusan & Tindak Lanjut:</h4>
                                    <div className="rounded-xl bg-emerald-50/50 p-4 text-sm text-gray-800 whitespace-pre-line leading-relaxed border border-emerald-200">
                                        {meeting.decisions || <span className="text-gray-400 italic">Belum ada keputusan final yang dicatat.</span>}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
