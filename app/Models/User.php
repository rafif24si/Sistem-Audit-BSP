<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'department_id',
        'role',
        'is_pjs',
        'pjs_role',
        'pjs_start_date',
        'pjs_end_date',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $appends = [
        'is_pjs_active',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_pjs' => 'boolean',
            'pjs_start_date' => 'date',
            'pjs_end_date' => 'date',
        ];
    }

    /**
     * Determine if PJS role is currently active within valid assignment period.
     */
    public function getIsPjsActiveAttribute(): bool
    {
        if (empty($this->pjs_role) && ! $this->is_pjs) {
            return false;
        }

        $today = now()->format('Y-m-d');

        if ($this->pjs_start_date && $today < $this->pjs_start_date->format('Y-m-d')) {
            return false;
        }

        if ($this->pjs_end_date && $today > $this->pjs_end_date->format('Y-m-d')) {
            return false;
        }

        return true;
    }

    /**
     * Permissions assigned to this user via pivot table.
     */
    public function permissions(): BelongsToMany
    {
        return $this->belongsToMany(Permission::class, 'user_permissions')
            ->withTimestamps();
    }

    /**
     * Check if user has specific module permission.
     */
    public function hasPermission(string $permission): bool
    {
        if ($this->role === 'super_admin') {
            return true;
        }

        // PJS Manager SPI yang masih aktif mewarisi wewenang penuh Manager SPI
        if ($this->is_pjs_active && ($this->pjs_role === 'manager_spi' || $this->role === 'manager_spi')) {
            return true;
        }

        // Cek permission granular dari tabel pivot user_permissions
        if ($this->relationLoaded('permissions')) {
            if ($this->permissions->contains('name', $permission)) {
                return true;
            }
        } elseif ($this->permissions()->where('name', $permission)->exists()) {
            return true;
        }

        return $this->hasRoleDefaultPermission($permission);
    }

    /**
     * Fallback to default permissions by role.
     */
    public function hasRoleDefaultPermission(string $permission): bool
    {
        return match ($this->role) {
            'super_admin' => true,
            'manager_spi' => true,
            'auditor' => in_array($permission, [
                'read_sop',
                'read_letters_internal', 'create_letters_internal', 'update_letters_internal',
                'read_letters_external', 'create_letters_external', 'update_letters_external',
                'read_disposition', 'update_disposition',
                'read_meeting', 'create_meeting', 'update_meeting',
                'read_kpi',
            ]),
            'auditee' => in_array($permission, [
                'read_sop',
                'read_letters_internal',
                'read_letters_external', 'update_letters_external',
                'read_disposition',
                'read_meeting',
                'read_kpi',
            ]),
            default => false,
        };
    }

    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class)->withTrashed();
    }

    public function masterDocuments(): HasMany
    {
        return $this->hasMany(MasterDocument::class, 'created_by');
    }

    public function letters(): HasMany
    {
        return $this->hasMany(Letter::class, 'created_by');
    }

    public function dispositionsGiven(): HasMany
    {
        return $this->hasMany(Disposition::class, 'from_user_id');
    }

    public function dispositionsReceived(): HasMany
    {
        return $this->hasMany(Disposition::class, 'to_user_id');
    }

    public function meetings(): HasMany
    {
        return $this->hasMany(Meeting::class, 'created_by');
    }

    public function activityLogs(): HasMany
    {
        return $this->hasMany(ActivityLog::class);
    }
}
