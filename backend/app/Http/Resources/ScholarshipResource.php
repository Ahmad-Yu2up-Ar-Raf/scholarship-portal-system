<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ScholarshipResource extends JsonResource
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
            'name' => $this->name,
            'slug' => $this->slug,
            'type' => $this->type instanceof \App\Enums\ScholarshipType ? $this->type->value : $this->type,
            'type_label' => $this->type instanceof \App\Enums\ScholarshipType ? $this->type->label() : null,
            'description' => $this->description,
            'color_theme' => $this->color_theme,
            'requirements' => $this->requirements,
            'beasiswas_count' => $this->whenCounted('beasiswas'),
        ];
    }
}
