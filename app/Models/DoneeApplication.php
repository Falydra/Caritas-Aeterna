<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DoneeApplication extends Model {
    protected $table = 'donee_applications';

    protected $fillable = [
        'status',
        'reviewed_at'
    ];

    public function applicant(): BelongsTo {
        return $this->belongsTo(Donor::class);
    }

    public function reviewer(): BelongsTo {
        return $this->belongsTo(Admin::class);
    }
}
