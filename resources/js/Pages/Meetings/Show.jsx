import { useState } from 'react';
import { useForm, Link, Head, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import StatusBadge from '@/Components/StatusBadge';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import MeetingInfoSidebar from '@/Components/Meetings/MeetingInfoSidebar';
import { ArrowLeft, FileDown, Save, CheckCircle2, Lock } from 'lucide-react';

export default function Show({ meeting, canEditNotulen, canChangeStatus }) {
    const inviteesList = Array.isArray(meeting.invitees) ? meeting.invitees : [];
    const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

    const { data, setData, patch, processing, errors } = useForm({
        discussion_points: meeting.discussion_points || '',
        decisions: meeting.decisions || '',
        status: meeting.status === 'Selesai' ? 'Selesai' : meeting.status,
    });

    const submit = (e) => {
        e.preventDefault();
        patch(route('meetings.update-minutes', meeting.id));
    };

    const handleMarkCompleted = () => {
        if (confirm(`Ubah status rapat '${meeting.title}' menjadi 'Selesai' untuk membuka E-Notulen?`)) {
            setIsUpdatingStatus(true);
            router.patch(route('meetings.update-status', meeting.id), { status: 'Selesai' }, {
                onFinish: () => setIsUpdatingStatus(false),
            });
        }
    };

    const isSelesai = meeting.status === 'Selesai';
    const isDibatalkan = meeting.status === 'Dibatalkan';

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex items-center space-x-3">
                        <Link
                            href={route('meetings.index')}
                            className="p-2 text-gray-500 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 leading-tight">Risalah E-Notulen Rapat</h2>
                            <p className="text-xs text-gray-500 mt-0.5">{meeting.meeting_type} &bull; Satuan Pengawasan Intern PT BSP</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2.5">
                        <StatusBadge status={meeting.confidentiality} type="confidentiality" />
                        <StatusBadge status={meeting.status} type="meeting_status" />
                        {isSelesai && (
                            <a
                                href={route('meetings.pdf', meeting.id)}
                                className="inline-flex items-center rounded-lg bg-[#c5221f] px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#a51b18] transition focus:ring-2 focus:ring-red-500 focus:outline-none"
                                title="Unduh Risalah Notulen PDF Ber-Kop Resmi PT BSP"
                            >
                                <FileDown className="h-4 w-4 me-1.5" />
                                <span>Unduh PDF</span>
                            </a>
                        )}
                    </div>
                </div>
            }
        >
            <Head title={`E-Notulen: ${meeting.title} - SPI PT BSP`} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <MeetingInfoSidebar meeting={meeting} inviteesList={inviteesList} />

                {/* Right column: E-Notulen Editor / Viewer / Locked State */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100">
                        <div className="border-b border-gray-100 pb-4 mb-6">
                            <h3 className="text-lg font-bold text-gray-900">Catatan E-Notulen Digital</h3>
                            <p className="text-xs text-gray-500 mt-0.5">Hasil resmi musyawarah audit dan butir tindak lanjut keputusan rapat</p>
                        </div>

                        {!isSelesai ? (
                            <div className="space-y-4">
                                <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-6 text-center space-y-3">
                                    <div className="mx-auto w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-700">
                                        <Lock className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-gray-900">Form E-Notulen Terkunci</h4>
                                        <p className="text-xs text-gray-600 mt-1 max-w-md mx-auto">
                                            Pengisian butir pembahasan dan keputusan rapat hanya dapat diakses setelah agenda rapat selesai diselenggarakan (status <strong>Selesai</strong>).
                                        </p>
                                    </div>
                                    {canChangeStatus && !isDibatalkan && (
                                        <div className="pt-2">
                                            <button
                                                type="button"
                                                onClick={handleMarkCompleted}
                                                disabled={isUpdatingStatus}
                                                className="inline-flex items-center rounded-lg bg-[#194f2b] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#123b20] transition disabled:opacity-75"
                                            >
                                                <CheckCircle2 className="w-4 h-4 me-1.5" />
                                                {isUpdatingStatus ? 'Memperbarui...' : 'Tandai Rapat Selesai & Buka E-Notulen'}
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {(meeting.discussion_points || meeting.decisions) && (
                                    <div className="space-y-4 pt-4 border-t border-gray-100 opacity-60">
                                        <div>
                                            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Draf Poin Pembahasan:</h4>
                                            <div className="rounded-xl bg-slate-50 p-4 text-xs text-gray-700 whitespace-pre-line border border-slate-200">
                                                {meeting.discussion_points}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : canEditNotulen ? (
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
                                            <option value="Selesai">Selesai (Finalkan Notulen)</option>
                                            <option value="Dibatalkan">Dibatalkan</option>
                                        </select>
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="inline-flex items-center justify-center rounded-lg bg-[#194f2b] px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#123b20] disabled:opacity-75 transition"
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
