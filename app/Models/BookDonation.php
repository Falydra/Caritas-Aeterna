<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
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
        return $this->belongsTo(Book::class, 'isbn');
    }

    public function donation(): BelongsTo {
        return $this->belongsTo(ProductDonation::class);
    }

    public function donationItem(): BelongsToMany {
        return $this->belongsToMany(
            DonationItem::class,
            'book_donation_item',
            'book_donation_id',
            'donation_item_id'
        )->withPivot('amount')->withTimestamps();
    }
}
