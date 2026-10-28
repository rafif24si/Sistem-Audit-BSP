<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Kpi extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'title',
        'category',
        'target_value',
        'realization_value',
        'unit',
        'period',
        'status',
        'notes',
        'order_index',
        'created_by',
        'updated_by',
    ];

    protected $appends = [
        'achievement_percentage',
    ];

    protected function casts(): array
    {
        return [
            'target_value' => 'float',
            'realization_value' => 'float',
            'order_index' => 'integer',
        ];
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updater(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    /**
     * Calculate achievement percentage.
     */
    public function getAchievementPercentageAttribute(): float
    {
        if ($this->target_value <= 0) {
            return 0;
        }

        $percentage = ($this->realization_value / $this->target_value) * 100;
        return round($percentage, 1);
    }
}
