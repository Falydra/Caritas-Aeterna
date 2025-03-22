<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DoneeApplication extends Model {
    protected $fillable = [
        'user_id',
        'status',
        'approved_by'
        /**
         * TODO: ADD DONEE FORM APPLICATION FIELDS (E.G. INSTITUSI, ALAMAT, NO. KTP, ETC.)
         */
    ];

    /**
     * User submitted application
     */
    public function user() {
        return $this->belongsTo(User::class);
    }
}
