<?php

namespace App\Models;

use App\Traits\UserChild;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Donor extends User {
    use UserChild;

    protected $guarded = [
        'type',
    ];

    public function doneeApplication(): HasMany {
        return $this->hasMany(DoneeApplication::class);
    }

    public function donations(): BelongsToMany {
        return $this->belongsToMany(Donation::class, 'donor_donation')->withPivot('verified_at');
    }
}
