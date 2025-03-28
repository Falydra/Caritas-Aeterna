<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class UserIdentity extends Model {
    protected $fillable = [
        'nik',
        'id_card_image'
    ];

    public function casts(): array {
        return [
            'verified_at' => 'datetime'
        ];
    }

    public function user(): BelongsTo {
        return $this->belongsTo(User::class);
    }

    public function address(): HasOne {
        return $this->hasOne(Address::class, 'user_identity_id');
    }
}
