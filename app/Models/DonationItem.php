<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class DonationItem extends Model {
    protected $table = 'donation_items';

    protected $fillable = [
        'package_picture',
        'resi',
        'status'
    ];

    public function donorDonation(): BelongsTo {
        return $this->belongsTo(DonorDonation::class);
    }

    public function books(): BelongsToMany {
        return $this->belongsToMany(
            BookDonation::class,
            'book_donation_item'
        )->withTimestamps();
    }

    public function facilities(): BelongsToMany {
        return $this->belongsToMany(
            Facility::class,
            'facility_donation_item'
        )->withTimestamps();
    }
}
