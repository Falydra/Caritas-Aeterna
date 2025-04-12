<?php

namespace App\Enums;

enum DonationStatusEnum: string {
    case PENDING = 'pending';
    case DENIED = 'denied';
    case ON_PROGRESS = 'on_progress';
    case FINISHED = 'finished';
}
