<?php

namespace App\Services;

use App\Models\Letter;
use App\Models\Meeting;
use App\Models\User;
use App\Notifications\GeneralSystemNotification;
use Carbon\Carbon;

class NotificationService
{
    /**
     * Synchronize actionable item notifications for a given user.
     */
    public static function syncActionableNotifications(User $user): void
    {
        $canApproveOrDispose = in_array($user->role, ['super_admin', 'manager_spi']) || $user->is_pjs_active;

        // 1. Pending Approvals for Outgoing Letters
        if ($canApproveOrDispose) {
            $pendingLetters = Letter::where('direction', 'outgoing')
                ->where('approval_status', 'pending_approval')
                ->latest()
                ->take(5)
                ->get();

            foreach ($pendingLetters as $letter) {
                if (! self::hasNotification($user, 'letter_approval', (string) $letter->id)) {
                    $user->notify(new GeneralSystemNotification([
                        'title' => 'Persetujuan Surat Keluar',
                        'message' => "Surat {$letter->letter_number} ({$letter->subject}) menunggu persetujuan Anda.",
                        'url' => route('letters.internal'),
                        'type' => 'approval',
                        'reference_type' => 'letter_approval',
                        'reference_id' => (string) $letter->id,
                    ]));
                }
            }

            // 2. Pending Dispositions for Incoming Letters
            $pendingDispositions = Letter::where('direction', 'incoming')
                ->doesntHave('dispositions')
                ->latest()
                ->take(5)
                ->get();

            foreach ($pendingDispositions as $letter) {
                if (! self::hasNotification($user, 'letter_disposition', (string) $letter->id)) {
                    $user->notify(new GeneralSystemNotification([
                        'title' => 'Disposisi Surat Masuk',
                        'message' => "Surat {$letter->letter_number} dari {$letter->sender} belum diberi lembar arahan disposisi.",
                        'url' => route('dispositions.index'),
                        'type' => 'disposition',
                        'reference_type' => 'letter_disposition',
                        'reference_id' => (string) $letter->id,
                    ]));
                }
            }
        }

        // 3. Pending Follow-Up for External Letters
        $followupQuery = Letter::where('scope', 'external')
            ->whereIn('followup_status', ['pending', 'in_progress']);

        if ($user->role === 'auditee') {
            if ($user->department_id) {
                $followupQuery->where('recipient_department_id', $user->department_id);
            } else {
                $followupQuery->whereRaw('1 = 0');
            }
        }

        $pendingFollowups = $followupQuery->latest('letter_date')->take(3)->get();
        foreach ($pendingFollowups as $letter) {
            if (! self::hasNotification($user, 'letter_followup', (string) $letter->id)) {
                $user->notify(new GeneralSystemNotification([
                    'title' => 'Tindak Lanjut Audit Eksternal',
                    'message' => "Tindak lanjut rekomendasi surat {$letter->letter_number}: {$letter->subject}",
                    'url' => route('letters.external'),
                    'type' => 'followup',
                    'reference_type' => 'letter_followup',
                    'reference_id' => (string) $letter->id,
                ]));
            }
        }

        // 4. Upcoming Meetings
        $today = Carbon::today()->toDateString();
        $meetings = Meeting::where('meeting_date_start', '>=', $today)
            ->latest('meeting_date_start')
            ->take(5)
            ->get();

        foreach ($meetings as $meeting) {
            $isInvited = is_array($meeting->invitees) && in_array($user->email, $meeting->invitees);
            $isCreatorOrAdmin = in_array($user->role, ['super_admin', 'manager_spi']) || $meeting->created_by === $user->id;

            if ($isInvited || $isCreatorOrAdmin) {
                if (! self::hasNotification($user, 'meeting', (string) $meeting->id)) {
                    $formattedDate = Carbon::parse($meeting->meeting_date_start)->translatedFormat('d M Y');
                    $user->notify(new GeneralSystemNotification([
                        'title' => 'Jadwal Rapat: ' . $meeting->title,
                        'message' => "Rapat {$meeting->meeting_type} ({$meeting->meeting_mode}) dijadwalkan pada {$formattedDate}.",
                        'url' => route('meetings.index'),
                        'type' => 'meeting',
                        'reference_type' => 'meeting',
                        'reference_id' => (string) $meeting->id,
                    ]));
                }
            }
        }
    }

    /**
     * Check if a notification with specific reference already exists for the user.
     */
    private static function hasNotification(User $user, string $referenceType, string $referenceId): bool
    {
        return $user->notifications()
            ->where('data', 'like', '%"reference_type":"' . $referenceType . '"%')
            ->where('data', 'like', '%"reference_id":"' . $referenceId . '"%')
            ->exists();
    }
}

