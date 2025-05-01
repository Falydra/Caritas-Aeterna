<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\Pivot;

class DonorDonation extends Model {
    protected $table = 'donor_donation';

    protected $fillable = [
        'donor_id',
        'donation_id',
        'verified_at'
    ];

    protected function casts(): array {
        return [
            'verified_at' => 'datetime',
        ];
    }

    public function donor(): BelongsTo {
        return $this->belongsTo(Donor::class);
    }

    public function donation(): BelongsTo {
        return $this->belongsTo(Donation::class);
    }

    public function donationItem(): HasOne {
        return $this->hasOne(DonationItem::class);
    }

    public function funds(): HasOne {
        return $this->hasOne(Fund::class);
    }
}
