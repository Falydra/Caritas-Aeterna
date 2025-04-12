<?php

namespace App\Models;

use App\Traits\DonationChild;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ProductDonation extends Donation {
    use DonationChild;

    protected $guarded = [
        'type',
    ];

    public function books(): BelongsToMany {
        return $this->belongsToMany(Book::class, 'book_donation')->withPivot(['amount', 'status']);
    }

    public function facilities(): HasMany {
        return $this->hasMany(Facility::class);
    }
}
