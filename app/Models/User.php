<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;

use App\Enums\RoleEnum;
use Illuminate\Support\Str;
use Illuminate\Notifications\Notifiable;
use App\Exceptions\InvalidUserTypeException;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable {
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    protected $table = 'users';

    protected $guarded = [
        'type',
    ];

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'email',
        'password',
        'username',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Create a new instance of the given model.
     *
     * @param  array  $attributes
     * @param  bool  $exists
     * @return static
     */
    public function newInstance($attributes = [], $exists = false) {
        // This method just provides a convenient way for us to generate fresh model
        // instances of this current model. It is particularly useful during the
        // hydration of new objects via the Eloquent query builder instances.

        $model = is_null($attributes['type'] ?? null) ?
            new static($attributes) :
            new $attributes['type']($attributes);

        $model->exists = $exists;

        $model->setConnection(
            $this->getConnectionName()
        );

        $model->setTable($this->getTable());

        $model->mergeCasts($this->casts);

        $model->fill((array) $attributes);

        return $model;
    }

    /**
     * Create a new model instance that is existing.
     *
     * @param  array  $attributes
     * @param  string|null  $connection
     * @return static
     */
    public function newFromBuilder($attributes = [], $connection = null) {
        $attributes = (array)$attributes;

        $model = $this->newInstance([
            'type' => $attributes['type'] ?? null
        ], true);

        $model->setRawAttributes($attributes, true);

        $model->setConnection($connection ?: $this->getConnectionName());

        $model->fireModelEvent('retrieved', false);

        return $model;
    }

    public function userProfile(): HasOne {
        return $this->hasOne(UserProfile::class, 'user_id');
    }

    public function userIdentity(): HasOne {
        return $this->hasOne(UserIdentity::class, 'user_id');
    }

    public function isVerified(): bool {
        return $this->email_verified_at !== null;
    }

    public function isAdmin(): bool {
        return static::class == Admin::class || static::class == SuperAdmin::class;
    }

    public function role(): string {
        return static::class;
    }

    public function roleName(): string {
        $role = $this->role();
        $slice = Str::afterLast($role, "\\");
        $slice = Str::lower($slice);
        return $slice;
    }
}
