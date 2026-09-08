<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Scholarship extends Model
{
    /** @use HasFactory<\Database\Factories\ScholarshipFactory> */
    use HasFactory;

    protected $fillable = ['name', 'slug', 'type', 'description', 'color_theme', 'requirements'];

    protected $casts = [
        'type' => \App\Enums\ScholarshipType::class,
    ];

    public function beasiswas()
    {
        return $this->hasMany(Beasiswa::class);
    }
}
