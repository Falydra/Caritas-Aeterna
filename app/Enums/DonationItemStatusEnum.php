<?php

namespace App\Enums;

enum DonationItemStatusEnum: string {
    case PENDING = 'pending';
    case WAITING_VERIFICATION = 'waiting_verification';
    case ON_DELIVERY = 'on_delivery';
    case FINISHED = 'finished';
}
