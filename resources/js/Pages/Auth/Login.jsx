import { useRef } from 'react';
import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Lock, Mail } from 'lucide-react';
import { Turnstile } from '@marsidev/react-turnstile';

export default function Login({ status, canResetPassword }) {
    const turnstileRef = useRef(null);
    const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY || '3x00000000000000000000FF';

    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
        cf_turnstile_response: '',
        'cf-turnstile-response': '',
    });

    const handleTurnstileSuccess = (token) => {
        setData((prev) => ({
            ...prev,
            cf_turnstile_response: token,
            'cf-turnstile-response': token,
        }));
    };

    const handleTurnstileClear = () => {
        setData((prev) => ({
            ...prev,
            cf_turnstile_response: '',
            'cf-turnstile-response': '',
        }));
    };

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => {
                reset('password');
                turnstileRef.current?.reset();
                handleTurnstileClear();
            },
        });
    };

    const isTurnstileVerified = !!(data.cf_turnstile_response || data['cf-turnstile-response']);

    return (
        <GuestLayout
            title="Masuk ke Akun Anda"
            subtitle="Gunakan kredensial resmi internal SPI PT BSP"
            logo="/images/logo.png"
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
                            placeholder="nama@bsp.com"
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

                {/* Cloudflare Turnstile Captcha Widget */}
                <div className="my-4 flex flex-col items-center justify-center">
                    <div className="flex justify-center items-center min-h-[65px] overflow-hidden">
                        <Turnstile
                            ref={turnstileRef}
                            siteKey={siteKey}
                            onSuccess={handleTurnstileSuccess}
                            onError={handleTurnstileClear}
                            onExpire={handleTurnstileClear}
                            options={{
                                theme: 'light',
                                size: 'normal',
                            }}
                        />
                    </div>
                    {(errors.cf_turnstile_response || errors['cf-turnstile-response']) && (
                        <InputError
                            message={errors.cf_turnstile_response || errors['cf-turnstile-response']}
                            className="mt-2 text-center text-xs"
                        />
                    )}
                </div>

                {/* Submit Button */}
                <div className="pt-1">
                    <button
                        type="submit"
                        disabled={processing || !isTurnstileVerified}
                        className="w-full flex items-center justify-center rounded-lg bg-[#194f2b] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#123b20] focus:outline-none focus:ring-2 focus:ring-[#194f2b] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {processing ? 'Memproses...' : 'Masuk'}
                    </button>
                    {!isTurnstileVerified && !processing && (
                        <p className="mt-1.5 text-center text-[11px] text-gray-400">
                            Selesaikan verifikasi keamanan di atas untuk masuk
                        </p>
                    )}
                </div>
            </form>
        </GuestLayout>
    );
}
