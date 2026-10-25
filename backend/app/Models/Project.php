<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable([
    'slug',
    'title',
    'category',
    'type',
    'description',
    'tools',
    'image',
    'alt',
    'github_url',
    'live_url',
    'position',
    'role',
    'year',
    'duration',
    'team',
])]
class Project extends Model
{
    /**
     * Use the slug in route URLs: /api/projects/tankcalc
     */
    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'tools' => 'array',
        ];
    }
}
