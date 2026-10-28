export default function StatusBadge({ status, type = 'status' }) {
    if (!status) return null;

    let style = 'bg-slate-100 text-slate-800 border-slate-200';
    let label = status;

    if (type === 'control_status') {
        const map = {
            TERKENDALI: {
                label: 'TERKENDALI',
                style: 'bg-emerald-100 text-emerald-800 border-emerald-200',
            },
            KADALUARSA: {
                label: 'KADALUARSA',
                style: 'bg-red-100 text-red-800 border-red-200',
            },
            TIDAK_TERKENDALI: {
                label: 'TIDAK TERKENDALI',
                style: 'bg-slate-100 text-slate-800 border-slate-200',
            },
        };
        if (map[status]) {
            label = map[status].label;
            style = map[status].style;
        }
    } else if (type === 'confidentiality') {
        const map = {
            Biasa: 'bg-blue-100 text-blue-800 border-blue-200',
            Terbatas: 'bg-amber-100 text-amber-800 border-amber-200',
            Rahasia: 'bg-orange-100 text-orange-800 border-orange-200',
            'Sangat Rahasia': 'bg-rose-100 text-rose-900 border-rose-300 font-bold',
        };
        if (map[status]) style = map[status];
    } else if (type === 'followup' || type === 'disposition_status') {
        const map = {
            not_required: {
                label: 'Tidak Perlu',
                style: 'bg-slate-100 text-slate-600 border-slate-200',
            },
            pending: {
                label: type === 'disposition_status' ? 'Belum Diproses' : 'Belum Tindak Lanjut',
                style: 'bg-red-100 text-red-800 border-red-200',
            },
            in_progress: {
                label: 'Dalam Proses',
                style: 'bg-blue-100 text-blue-800 border-blue-200',
            },
            completed: {
                label: 'Selesai',
                style: 'bg-emerald-100 text-emerald-800 border-emerald-200',
            },
        };
        if (map[status]) {
            label = map[status].label;
            style = map[status].style;
        }
    } else if (type === 'urgency') {
        const map = {
            Biasa: 'bg-emerald-100 text-emerald-800 border-emerald-200',
            Segera: 'bg-blue-100 text-blue-800 border-blue-200',
            Kilat: 'bg-red-100 text-red-800 border-red-200 font-bold',
        };
        if (map[status]) style = map[status];
    } else if (type === 'meeting_status') {
        const map = {
            Terjadwal: 'bg-blue-100 text-blue-800 border-blue-200',
            Berlangsung: 'bg-amber-100 text-amber-800 border-amber-200',
            Selesai: 'bg-emerald-100 text-emerald-800 border-emerald-200',
            Dibatalkan: 'bg-red-100 text-red-800 border-red-200',
        };
        if (map[status]) style = map[status];
    } else if (type === 'approval_status') {
        const map = {
            draft: {
                label: 'Draf',
                style: 'bg-slate-100 text-slate-700 border-slate-200',
            },
            pending_approval: {
                label: 'Menunggu Approval',
                style: 'bg-amber-100 text-amber-800 border-amber-200',
            },
            approved: {
                label: 'Disetujui',
                style: 'bg-emerald-100 text-emerald-800 border-emerald-200',
            },
            rejected: {
                label: 'Ditolak',
                style: 'bg-red-100 text-red-800 border-red-200',
            },
        };
        if (map[status]) {
            label = map[status].label;
            style = map[status].style;
        }
    }

    return (
        <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border ${style}`}
        >
            {label}
        </span>
    );
}
