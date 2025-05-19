<?php

namespace App\Services;

use App\Models\User;
use App\Models\Donee;
use App\Models\DoneeApplication;

class DoneeApplicationService {
    public function acceptApplication(DoneeApplication $application) {
        $user = $application->applicant;
        $user->update([
            'type' => Donee::class
        ]);
        $user->save();
    }
}
