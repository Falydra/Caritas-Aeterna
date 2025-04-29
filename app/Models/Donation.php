<?php

namespace App\Models;

use App\Models\UserIdentity;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

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
            'created_at' =>'datetime',
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

    public function initiator(): BelongsTo {
        return $this->belongsTo(Donee::class);
    }

    public function reviewer(): BelongsTo {
        return $this->belongsTo(Admin::class);
    }

    public function donors(): BelongsToMany {
        return $this->belongsToMany(Donor::class, 'donor_donation')->withPivot('verified_at')->withTimestamps();
    }

    public function type(): string {
        return static::class;
    }
}
