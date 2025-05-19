<?php

namespace App\Models;

use App\Enums\DoneeApplicationStatusEnum;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DoneeApplication extends Model {
    protected $table = 'donee_applications';

    protected $fillable = [
        'status',
        'reviewed_by',
        'reviewed_at'
    ];

    public function applicant(): BelongsTo {
        return $this->belongsTo(Donor::class, 'donor_id');
    }

    public function reviewer(): BelongsTo {
        return $this->belongsTo(Admin::class, 'reviewed_by');
    }

    public function accept(Admin $reviewer): void {
        $this->update([
            'status' => DoneeApplicationStatusEnum::ACCEPTED->value
        ]);
        $this->reviewer()->associate($reviewer);
        $this->save();
    }

    public function deny(Admin $reviewer): void {
        $this->update([
            'status' => DoneeApplicationStatusEnum::DENIED->value
        ]);
        $this->reviewer()->associate($reviewer);
        $this->save();
    }
}
