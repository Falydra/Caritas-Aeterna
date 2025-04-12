<?php

namespace App\Models;

use App\Traits\UserChild;
use Illuminate\Database\Eloquent\Model;

class SuperAdmin extends User {
    use UserChild;
}
