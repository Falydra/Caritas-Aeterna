<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphOne;

class Fund extends Model {
    protected $table = 'funds';

    protected $fillable = [
        'order_id',
        'donation_id',
        'donation_type',
        'amount',
        'snap_token',
        'redirect_url',
        'status',
        'note',
    ];

    protected function casts(): array {
        return [
            'transfer_date' => 'datetime',
            'created_at' => 'datetime'
        ];
    }

    public function getFormattedCreatedAtAttribute() {
        return $this->created_at->format('Y-m-d H:i:s');
    }

    /**
     * Set status to Pending
     *
     * @return void
     */
    public function setPending() {
        $this->attributes['status'] = 'pending';
        $this->save();
    }

    /**
     * Set status to Success
     *
     * @return void
     */
    public function setSuccess() {
        $this->attributes['status'] = 'success';
        $this->save();
    }

    /**
     * Set status to Failed
     *
     * @return void
     */
    public function setFailed() {
        $this->attributes['status'] = 'failed';
        $this->save();
    }

    /**
     * Set status to Expired
     *
     * @return void
     */
    public function setExpired() {
        $this->attributes['status'] = 'expired';
        $this->save();
    }

    public function donation(): BelongsTo {
        return $this->belongsTo(Fundraiser::class);
    }

    public function donorDonation(): BelongsTo {
        return $this->belongsTo(DonorDonation::class);
    }
}
