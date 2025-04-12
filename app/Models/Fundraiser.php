<?php

namespace App\Models;

use App\Traits\DonationChild;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Fundraiser extends Donation {
    use DonationChild;

    protected $guarded = [
        'type',
    ];

    public function funds(): HasMany {
        return $this->hasMany(Fund::class);
    }
}
