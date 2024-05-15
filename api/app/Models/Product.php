<?php

declare(strict_types=1);

namespace App\Models;

use App\Http\Filters\QueryFilter;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Laravel\Scout\Searchable;
use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;

class Product extends Model
{
    use HasFactory, HasSlug, Searchable;

    protected $guarded = [];

    protected $appends = ['formatted_price', 'main_image'];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function brand(): BelongsTo
    {
        return $this->belongsTo(Brand::class);
    }

    public function sizes(): BelongsToMany
    {
        return $this->belongsToMany(Size::class, 'product_sizes')
            ->withPivot('stock')
            ->withTimestamps();
    }

    public function attributes(): HasMany
    {
        return $this->hasMany(ProductAttribute::class);
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }

    public function collection(): BelongsTo
    {
        return $this->belongsTo(Collection::class);
    }

    public function associations(): HasMany
    {
        return $this->hasMany(Association::class);
    }

    public function productAttributes(): HasMany
    {
        return $this->hasMany(ProductAttribute::class);
    }

    public function getFormattedPriceAttribute(): string
    {
        return number_format($this->price / 100, 2, ',', '.');
    }

    public function getMainImageAttribute(): string
    {
        if (is_array($this->images[0]) && array_key_exists('url', $this->images[0])) {
            return $this->images[0]['url'];
        }

        return '';
    }

    public function bookmark(): HasOne
    {
        return $this->hasOne(Bookmark::class);
    }

    public function review(): HasOne
    {
        return $this->hasOne(Review::class);
    }

    public function getSlugOptions(): SlugOptions
    {
        return SlugOptions::create()
            ->generateSlugsFrom('name')
            ->saveSlugsTo('url');
    }

    public function getRouteKeyName(): string
    {
        return 'url';
    }

    public function scopeFilter(Builder $builder, QueryFilter $filters): Builder
    {
        return $filters->apply($builder);
    }

    protected function casts(): array
    {
        return [
            'images' => 'array',
        ];
    }
}
