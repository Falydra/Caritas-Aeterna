<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

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
}
