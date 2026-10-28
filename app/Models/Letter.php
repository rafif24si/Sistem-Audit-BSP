<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Letter extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'agenda_number',
        'letter_number',
        'scope',
        'direction',
        'letter_type_code',
        'subject',
        'sender',
        'recipient',
        'recipient_department_id',
        'letter_date',
        'received_date',
        'confidentiality',
        'approval_status',
        'approved_by',
        'approval_notes',
        'file_path',
        'followup_status',
        'followup_notes',
        'followup_due_date',
        'created_by',
    ];

    protected function casts(): array
    {
        return [
            'letter_date' => 'date',
            'received_date' => 'date',
            'followup_due_date' => 'date',
        ];
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function recipientDepartment(): BelongsTo
    {
        return $this->belongsTo(Department::class, 'recipient_department_id');
    }

    public function approver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    public function dispositions(): HasMany
    {
        return $this->hasMany(Disposition::class);
    }
}
