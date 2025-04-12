<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\Pivot;

class BookDonation extends Pivot {
    use HasFactory;

    protected $table = 'book_donation';

    protected $fillable = [
        'donation_id',
        'isbn',
        'status'
    ];

    public function book(): BelongsTo {
        return $this->belongsTo(Book::class);
    }

    public function donation(): BelongsTo {
        return $this->belongsTo(ProductDonation::class);
    }
}
