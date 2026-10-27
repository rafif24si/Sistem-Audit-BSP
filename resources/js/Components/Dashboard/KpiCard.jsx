import { Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';

export default function KpiCard({ title, count, sub, href, icon: Icon, iconColor }) {
    return (
        <Link
            href={href}
            className="rounded-xl border border-gray-200 p-5 bg-white shadow-sm hover:shadow-md transition-all group flex flex-col justify-between"
        >
            <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                    {title}
                </span>
                <div className={`p-2 rounded-lg ${iconColor}`}>
                    <Icon className="h-4 w-4" />
                </div>
            </div>
            <div className="mt-4">
                <div className="text-2xl font-black text-gray-900 group-hover:text-[#194f2b] transition-colors">
                    {count}
                </div>
                <p className="text-xs text-gray-500 mt-0.5">{sub}</p>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-semibold text-emerald-700">
                <span>Buka Modul</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
        </Link>
    );
}
