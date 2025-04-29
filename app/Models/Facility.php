<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Facility extends Model {
    protected $table = 'facilities';

    protected $fillable = [
        'name',
        'description',
        'dimension',
        'material',
        'price',
        'amount',
        'status'
    ];

    public function donation(): BelongsTo {
        return $this->belongsTo(ProductDonation::class);
    }

    public function donationItem(): BelongsToMany {
        return $this->belongsToMany(
            DonationItem::class,
            'facility_donation_item'
        );
    }
}
