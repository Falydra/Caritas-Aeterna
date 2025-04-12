<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Book extends Model {
    protected $table = "books";

    protected $fillable = [
        'isbn',
        'title',
        'authors',
        'published_year',
        'synopsis',
        'price'
    ];

    public function casts(): array {
        return [
            'authors' => 'array',
            'created_at' => 'datetime',
            'updated_at' => 'datetime'
        ];
    }

    public function donations(): BelongsToMany {
        return $this->belongsToMany(ProductDonation::class, 'book_donation')->withPivot(['amount', 'status']);
    }
}
