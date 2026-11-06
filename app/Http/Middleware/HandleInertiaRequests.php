<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user() ? $request->user()->load('department') : null,
            ],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],
            'notifications' => function () use ($request) {
                $user = $request->user();
                if (! $user) {
                    return ['count' => 0, 'items' => []];
                }

                \App\Services\NotificationService::syncActionableNotifications($user);

                $allNotifications = $user->notifications()
                    ->latest()
                    ->take(20)
                    ->get();

                $unreadCount = $user->unreadNotifications()->count();

                $items = $allNotifications->map(function ($n) {
                    $data = $n->data ?? [];
                    return [
                        'id' => $n->id,
                        'title' => $data['title'] ?? 'Notifikasi Sistem',
                        'message' => $data['message'] ?? '',
                        'url' => $data['url'] ?? '#',
                        'type' => $data['type'] ?? 'general',
                        'read' => ! is_null($n->read_at),
                        'created_at' => $n->created_at ? $n->created_at->locale('id')->diffForHumans() : '',
                    ];
                })->values()->toArray();

                return [
                    'count' => $unreadCount,
                    'items' => $items,
                ];
            },
        ];
    }
}
