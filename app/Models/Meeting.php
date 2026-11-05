<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Meeting extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'title',
        'meeting_type',
        'meeting_mode',
        'platform',
        'meeting_date_start',
        'meeting_date_end',
        'start_time',
        'end_time',
        'location',
        'invitees',
        'discussion_points',
        'decisions',
        'confidentiality',
        'status',
        'attachment_path',
        'created_by',
    ];

    protected function casts(): array
    {
        return [
            'meeting_date_start' => 'date',
            'meeting_date_end' => 'date',
            'invitees' => 'array',
        ];
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by')->withTrashed();
    }
}
