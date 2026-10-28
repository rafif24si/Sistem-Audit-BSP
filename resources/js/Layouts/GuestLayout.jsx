import { Shield } from 'lucide-react';
import Toast from '@/Components/Toast';

export default function GuestLayout({ children, title, subtitle, logo = '/images/logo.png' }) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-slate-100/80 px-4 py-8 sm:px-6 lg:px-8">
            <Toast />

            <div className="w-full max-w-md">
                {/* Brand Header */}
                <div className="mb-8 text-center">
                    {logo ? (
                        <div className="inline-flex items-center justify-center p-1 rounded-full bg-white shadow-md border-2 border-emerald-600/30 ring-4 ring-emerald-100/80">
                            <img
                                src={logo}
                                alt="Logo PT Bumi Siak Pusako"
                                className="h-20 w-20 rounded-full object-cover"
                            />
                        </div>
                    ) : (
                        <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-[#194f2b] text-white shadow-lg ring-4 ring-emerald-100">
                            <Shield className="h-9 w-9 text-emerald-300" />
                        </div>
                    )}
                    <h1 className="mt-4 text-2xl font-bold tracking-tight text-gray-900">
                        {title || 'Sistem Integrasi SPI'}
                    </h1>
                    <p className="mt-1 text-sm font-semibold tracking-wide text-emerald-800">
                        PT BUMI SIAK PUSAKO
                    </p>
                    {subtitle && (
                        <p className="mt-1 text-xs text-gray-500">
                            {subtitle}
                        </p>
                    )}
                </div>

                {/* Form Card */}
                <div className="rounded-2xl bg-white p-6 sm:p-8 shadow-xl shadow-slate-200/50 border border-gray-100">
                    {children}
                </div>

                {/* Footer copyright */}
                <p className="mt-8 text-center text-xs text-gray-400">
                    &copy; {new Date().getFullYear()} Satuan Pengawasan Intern - PT Bumi Siak Pusako. All rights reserved.
                </p>
            </div>
        </div>
    );
}
