import { Calendar, MapPin, Video, Users, Download, Shield, ExternalLink, CheckCircle2 } from 'lucide-react';

export default function MeetingInfoSidebar({ meeting, inviteesList }) {
    return (
        <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
                <h3 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3">Informasi Agenda</h3>
                <div>
                    <h4 className="text-sm font-bold text-gray-900">{meeting.title}</h4>
                    <p className="text-xs text-emerald-800 font-medium mt-0.5">{meeting.meeting_type}</p>
                </div>
                <div className="space-y-3 text-xs text-gray-600">
                    <div className="flex items-center">
                        <Calendar className="h-4 w-4 me-2 text-gray-400 shrink-0" />
                        <span>
                            {meeting.meeting_date_start}
                            {meeting.meeting_date_end && meeting.meeting_date_end !== meeting.meeting_date_start ? ` s/d ${meeting.meeting_date_end}` : ''}
                            &nbsp;({meeting.start_time} - {meeting.end_time || 'Selesai'} WIB)
                        </span>
                    </div>
                    <div className="flex items-start">
                        {meeting.meeting_mode === 'Online' ? (
                            <Video className="h-4 w-4 me-2 text-blue-500 shrink-0 mt-0.5" />
                        ) : (
                            <MapPin className="h-4 w-4 me-2 text-emerald-600 shrink-0 mt-0.5" />
                        )}
                        <div>
                            <div className="font-semibold text-gray-800">
                                Mode: {meeting.meeting_mode || 'Offline'} &bull; {meeting.platform || (meeting.meeting_mode === 'Online' ? 'Zoom' : 'Tatap Muka')}
                            </div>
                            <div className="text-gray-500 mt-0.5 break-all">
                                {meeting.meeting_mode === 'Online' && meeting.location?.startsWith('http') ? (
                                    <a
                                        href={meeting.location}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-blue-600 underline hover:text-blue-800 inline-flex items-center"
                                    >
                                        {meeting.location}
                                        <ExternalLink className="h-3 w-3 ms-1" />
                                    </a>
                                ) : (
                                    meeting.location
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center">
                        <Shield className="h-4 w-4 me-2 text-gray-400 shrink-0" />
                        <span>Penyelenggara: {meeting.creator?.name || 'SPI PT BSP'}</span>
                    </div>
                </div>

                {meeting.attachment_path && (
                    <div className="pt-2">
                        <a
                            href={route('meetings.download', meeting.id)}
                            className="inline-flex w-full items-center justify-center rounded-lg bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-800 hover:bg-emerald-100 border border-emerald-200 transition"
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
    );
}

