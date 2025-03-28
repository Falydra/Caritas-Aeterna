<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserProfile extends Model {
    protected $fillable = [
        'full_name',
        'phone_number',
        'date_of_birth',
        'gender',
        'profile_picture',
        'last_updated'
    ];

    public function casts(): array {
        return [
            'date_of_birth' => 'date',
            'last_updated' => 'datetime'
        ];
    }

    public function user(): BelongsTo {
        return $this->belongsTo(User::class);
    }
}
