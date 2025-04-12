<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
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

    public function donation(): BelongsTo {
        return $this->belongsTo(ProductDonation::class);
    }
}
