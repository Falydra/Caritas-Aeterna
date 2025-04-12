<?php

namespace App\Enums;

enum ProductStatusEnum: string {
    case FULFILLED = 'fulfilled';
    case NOT_FULFILLED = 'not_fulfilled';
}
