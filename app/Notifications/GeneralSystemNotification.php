<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class GeneralSystemNotification extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     *
     * @param  array{title: string, message: string, url: string, type: string, reference_type?: string, reference_id?: int|string}  $payload
     */
    public function __construct(
        public array $payload
    ) {}

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database'];
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toDatabase(object $notifiable): array
    {
        return $this->payload;
    }
}

