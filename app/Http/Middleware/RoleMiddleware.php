<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     * @param  string  ...$roles
     */
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        $user = $request->user();

        if (! $user) {
            return redirect()->route('login');
        }

        // Super Admin memiliki akses penuh tanpa terkecuali
        if ($user->role === 'super_admin') {
            return $next($request);
        }

        // PJS Manager SPI yang masih aktif masa berlakunya mewarisi wewenang rute manager_spi
        if ($user->is_pjs_active && ($user->pjs_role === 'manager_spi' || $user->is_pjs) && in_array('manager_spi', $roles)) {
            return $next($request);
        }

        if (! in_array($user->role, $roles)) {
            abort(403, 'Akses Ditolak: Anda tidak memiliki izin untuk mengakses halaman ini.');
        }

        return $next($request);
    }
}
