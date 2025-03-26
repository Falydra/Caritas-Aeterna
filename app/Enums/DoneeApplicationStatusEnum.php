<?php

namespace App\Enums;

enum DoneeApplicationStatusEnum: string {
    case ACCEPTED = "accepted";
    case DENIED = "denied";
    case PENDING = "pending";
}
