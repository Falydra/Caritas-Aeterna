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
        'product_amount',
        'status'
    ];

    protected function casts(): array {
        return [
            'created_at' => 'datetime'
        ];
    }

    public function amount(): string {
        return (string) $this->product_amount;
    }

    public function getFormattedCreatedAtAttribute() {
        return $this->created_at->format('Y-m-d H:i:s');
    }

    public function addItem(int $amount): void {
        $this->update([
            'product_amount' => $this->product_amount + $amount
        ]);
        $this->save();
    }

    public function donorDonation(): BelongsTo {
        return $this->belongsTo(DonorDonation::class);
    }

    public function books(): BelongsToMany {
        return $this->belongsToMany(
            BookDonation::class,
            'book_donation_item',
            'donation_item_id',
            'book_donation_id'
        )->withPivot('amount')->withTimestamps();
    }

    public function facilities(): BelongsToMany {
        return $this->belongsToMany(
            Facility::class,
            'facility_donation_item'
        )->withPivot('amount')->withTimestamps();
    }
}
