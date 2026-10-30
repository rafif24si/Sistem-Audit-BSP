<?php

namespace App\Mail;

use App\Models\Meeting;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class MeetingUpdatedMail extends Mailable
{
    use Queueable, SerializesModels;

    public Meeting $meeting;

    /**
     * Create a new message instance.
     */
    public function __construct(Meeting $meeting)
    {
        $this->meeting = $meeting;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        $fromAddress = config('mail.from.address');
        $fromName = config('mail.from.name', 'SPI PT Bumi Siak Pusako');

        $from = filter_var($fromAddress, FILTER_VALIDATE_EMAIL)
            ? new Address($fromAddress, $fromName)
            : new Address('no-reply@ptbsp.id', $fromName);

        return new Envelope(
            from: $from,
            subject: "[REVISI JADWAL] {$this->meeting->title} - SPI PT Bumi Siak Pusako",
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.meeting_updated',
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}

