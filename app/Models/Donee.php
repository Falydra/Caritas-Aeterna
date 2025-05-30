<?php

namespace App\Models;

use App\Traits\UserChild;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Donee extends User {
    use UserChild;

    protected $guarded = [
        'type',
    ];

    public function donations(): HasMany {
        return $this->hasMany(Donation::class, 'initiator_id');
    }
}
