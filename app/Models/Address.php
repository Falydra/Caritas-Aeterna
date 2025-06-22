<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Address extends Model {
    protected $fillable = [
        'user_identity_id',
        'address_detail',
        'rt',
        'rw',
        'kelurahan',
        'kecamatan',
        'city',
        'province',
        'postal_code'
    ];

    public function userIdentity(): BelongsTo {
        return $this->belongsTo(UserIdentity::class);
    }
}
