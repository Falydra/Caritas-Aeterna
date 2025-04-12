<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphOne;

class Fund extends Model {
    protected $table = 'funds';

    protected $fillable = [
        'amount',
        'transfer_date'
    ];

    protected function casts(): array {
        return [
            'transfer_date' => 'datetime'
        ];
    }

    public function donation(): BelongsTo {
        return $this->belongsTo(Fundraiser::class);
    }

    public function donorDonation(): BelongsTo {
        return $this->belongsTo(DonorDonation::class);
    }
}
