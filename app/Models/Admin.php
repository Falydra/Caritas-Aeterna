<?php

namespace App\Models;

use App\Traits\UserChild;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Admin extends User {
    use UserChild;

    public function donationsReviewed(): HasMany {
        return $this->hasMany(Donation::class, 'reviewed_by');
    }

    public function doneeApplicationsReviewed(): HasMany {
        return $this->hasMany(DoneeApplication::class);
    }
}
