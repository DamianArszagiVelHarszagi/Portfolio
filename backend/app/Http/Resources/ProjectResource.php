<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class ProjectResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'title' => $this->title,
            'category' => $this->category,
            'type' => $this->type,
            'description' => $this->description,
            'tools' => $this->tools,
            'image' => $this->image ? Storage::disk('public')->url($this->image) : null,
            'alt' => $this->alt,
            'github_url' => $this->github_url,
            'live_url' => $this->live_url,
            'position' => $this->position,
            'role' => $this->role,
            'year' => $this->year,
            'duration' => $this->duration,
            'team' => $this->team,
        ];
    }
}
