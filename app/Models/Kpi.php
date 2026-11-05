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
        'polarity',
        'status',
        'notes',
        'evidence_path',
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
        return $this->belongsTo(User::class, 'created_by')->withTrashed();
    }

    public function updater(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by')->withTrashed();
    }

    /**
     * Calculate achievement percentage based on target, realization, and polarity.
     */
    public function getAchievementPercentageAttribute(): float
    {
        if ($this->target_value <= 0) {
            return 0;
        }

        if ($this->polarity === 'negative') {
            // Semakin kecil realisasi semakin baik
            if ($this->realization_value <= $this->target_value) {
                $percentage = 100;
            } else {
                $percentage = max(0, (2 - ($this->realization_value / $this->target_value)) * 100);
            }
        } else {
            // Semakin besar realisasi semakin baik
            $percentage = ($this->realization_value / $this->target_value) * 100;
        }

        return round(min(100, max(0, $percentage)), 1);
    }
}
