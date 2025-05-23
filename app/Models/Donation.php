<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Support\Str;
use App\Models\UserIdentity;
use App\Enums\DonationStatusEnum;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Donation extends Model {
    protected $table = 'donations';

    protected $guarded = [
        'type'
    ];

    protected $fillable = [
        'title',
        'type',
        'type_attributes',
        'text_descriptions',
        'image_descriptions',
        'header_image',
        'status',
        'reviewed_by',
        'reviewed_at',
    ];

    public function casts(): array {
        return [
            'type_attributes' => 'array',
            'text_descriptions' => 'array',
            'image_descriptions' => 'array',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
            'reviewed_at' => 'datetime'
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

    /**
     * Relationship
     */
    public function initiator(): BelongsTo {
        return $this->belongsTo(Donee::class);
    }

    public function reviewer(): BelongsTo {
        return $this->belongsTo(Admin::class, 'reviewed_by');
    }

    public function donors(): BelongsToMany {
        return $this->belongsToMany(Donor::class, 'donor_donation', 'donation_id')->withPivot('verified_at')->withTimestamps();
    }

    public function donorDonations(): HasMany {
        return $this->hasMany(DonorDonation::class, 'donation_id');
    }

    /**
     * Class Methods
     */
    public function type(): string {
        return static::class;
    }

    public function category(): string {
        return Str::afterLast(static::class, '\\');
    }

    public function typeAttributes(): array {
        return $this->type_attributes;
    }

    public function setPending(User $user): void {
        if ($user->role() !== Admin::class) {
            return;
        }

        if ($this->status !== DonationStatusEnum::PENDING->value) {
            $this->update([
                'status' => DonationStatusEnum::PENDING->value,
                'reviewed_by' => $user->id,
                'reviewed_at' => now()
            ]);
            $this->reviewer()->associate($user);
            $this->save();
        }
    }

    public function setOnProgress(User $user): void {
        if ($user->role() !== Admin::class) {
            return;
        }

        if ($this->status !== DonationStatusEnum::ON_PROGRESS->value) {
            $this->update([
                'status' => DonationStatusEnum::ON_PROGRESS->value,
                'reviewed_by' => $user->id,
                'reviewed_at' => now()
            ]);
            $this->reviewer()->associate($user);
            $this->save();
        }
    }

    public function setDenied(User $user): void {
        if ($user->role() !== Admin::class) {
            return;
        }

        if ($this->status !== DonationStatusEnum::DENIED->value) {
            $this->update([
                'status' => DonationStatusEnum::DENIED->value,
                'reviewed_by' => $user->id,
                'reviewed_at' => now()
            ]);
            $this->reviewer()->associate($user);
            $this->save();
        }
    }

    public function setFinished(User $user): void {
        if ($user->role() !== Admin::class) {
            return;
        }

        if ($this->status !== DonationStatusEnum::FINISHED->value) {
            $this->update([
                'status' => DonationStatusEnum::FINISHED->value,
                'reviewed_by' => $user->id,
                'reviewed_at' => now()
            ]);
            $this->reviewer()->associate($user);
            $this->save();
        }
    }

    public static function getActiveDonation() {
        $donation = Donation::with('initiator:id,username')
            ->where('status', 'on_progress')
            ->orWhere('status', 'finished')
            ->get();
        return $donation;
    }
}
