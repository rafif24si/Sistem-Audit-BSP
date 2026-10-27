import { useState } from 'react';
import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Lock, Mail, RotateCw, ShieldCheck } from 'lucide-react';

export default function Login({ status, canResetPassword, captchaQuestion: initialCaptcha }) {
    const [captchaText, setCaptchaText] = useState(initialCaptcha || '5 + 3 = ?');
    const [isRefreshingCaptcha, setIsRefreshingCaptcha] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        captcha: '',
        remember: false,
    });

    const refreshCaptcha = async () => {
        setIsRefreshingCaptcha(true);
        try {
            const res = await fetch(route('captcha.refresh'));
            const result = await res.json();
            if (result.question) {
                setCaptchaText(result.question);
                setData('captcha', '');
            }
        } catch (err) {
            console.error('Failed to refresh captcha', err);
        } finally {
            setIsRefreshingCaptcha(false);
        }
    };

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => {
                reset('password', 'captcha');
                refreshCaptcha();
            },
        });
    };

    return (
        <GuestLayout
            title="Masuk ke Akun Anda"
            subtitle="Gunakan kredensial resmi internal SPI PT BSP"
        >
            <Head title="Masuk - Sistem Integrasi SPI" />

            {status && (
                <div className="mb-4 rounded-lg bg-emerald-50 p-3 text-sm font-medium text-emerald-800 border border-emerald-200">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-4">
                {/* Email Field */}
                <div>
                    <InputLabel htmlFor="email" value="Alamat Email" />
                    <div className="relative mt-1">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                            <Mail className="h-4 w-4" />
                        </div>
                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            placeholder="nama@bsp.co.id"
                            className="block w-full pl-9"
                            autoComplete="username"
                            isFocused={true}
                            onChange={(e) => setData('email', e.target.value)}
                        />
                    </div>
                    <InputError message={errors.email} className="mt-1.5" />
                </div>

                {/* Password Field */}
                <div>
                    <InputLabel htmlFor="password" value="Kata Sandi" />
                    <div className="relative mt-1">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                            <Lock className="h-4 w-4" />
                        </div>
                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            placeholder="••••••••"
                            className="block w-full pl-9"
                            autoComplete="current-password"
                            onChange={(e) => setData('password', e.target.value)}
                        />
                    </div>
                    <InputError message={errors.password} className="mt-1.5" />
                </div>

                {/* Captcha Field */}
                <div className="rounded-xl border border-gray-200 bg-slate-50/80 p-3.5 space-y-2.5">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-xs font-semibold text-gray-700">
                            <ShieldCheck className="h-4 w-4 text-emerald-600" />
                            <span>Verifikasi Keamanan (Captcha)</span>
                        </div>
                        <button
                            type="button"
                            onClick={refreshCaptcha}
                            disabled={isRefreshingCaptcha}
                            className="inline-flex items-center space-x-1 text-xs text-emerald-700 hover:text-emerald-900 focus:outline-none"
                            title="Segarkan Captcha"
                        >
                            <RotateCw className={`h-3.5 w-3.5 ${isRefreshingCaptcha ? 'animate-spin' : ''}`} />
                            <span>Acak</span>
                        </button>
                    </div>

                    <div className="flex items-center space-x-3">
                        <div className="flex h-10 select-none items-center justify-center rounded-lg bg-emerald-800 px-4 text-base font-bold tracking-wider text-emerald-100 shadow-inner">
                            {captchaText}
                        </div>
                        <div className="flex-1">
                            <TextInput
                                id="captcha"
                                type="text"
                                name="captcha"
                                value={data.captcha}
                                placeholder="Jawaban angka"
                                className="block w-full"
                                onChange={(e) => setData('captcha', e.target.value)}
                            />
                        </div>
                    </div>
                    <InputError message={errors.captcha} className="mt-1" />
                </div>

                {/* Remember & Forgot Password */}
                <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center cursor-pointer">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) => setData('remember', e.target.checked)}
                        />
                        <span className="ms-2 text-xs text-gray-600">
                            Ingat saya di perangkat ini
                        </span>
                    </label>

                    {canResetPassword && (
                        <Link
                            href={route('password.request')}
                            className="text-xs text-emerald-800 hover:text-emerald-950 hover:underline"
                        >
                            Lupa kata sandi?
                        </Link>
                    )}
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full flex items-center justify-center rounded-lg bg-[#194f2b] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#123b20] focus:outline-none focus:ring-2 focus:ring-[#194f2b] focus:ring-offset-2 disabled:opacity-75 disabled:cursor-not-allowed"
                    >
                        {processing ? 'Memproses...' : 'Masuk ke Sistem'}
                    </button>
                </div>
            </form>
        </GuestLayout>
    );
}
