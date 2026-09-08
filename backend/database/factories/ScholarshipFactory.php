<?php

namespace Database\Factories;

use App\Models\Scholarship;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Scholarship>
 */
class ScholarshipFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->randomElement(['Akademik', 'Non-Akademik']),
            'slug' => fn (array $attr) => strtolower(str_replace(' ', '-', $attr['name'])) . '-' . fake()->unique()->randomNumber(4),
            'description' => fake()->sentence(12),
            'color_theme' => fake()->randomElement(['oklch(0.86 0.19 90)', 'oklch(0.72 0.22 25)', 'oklch(0.75 0.15 230)', 'oklch(0.78 0.18 140)']),
            'requirements' => fake()->paragraph(2),
        ];
    }

    public function akademik(): static
    {
        return $this->state(fn (array $attr) => [
            'name' => 'Akademik',
            'slug' => 'akademik',
            'description' => 'Beasiswa prestasi akademik untuk mahasiswa IPK ≥3.00 dengan transkrip dan essay motivasi.',
            'color_theme' => 'oklch(0.86 0.19 90)',
            'requirements' => 'IPK ≥3.00 • Semester 1–8 • Transkrip • Surat aktif kuliah',
        ]);
    }

    public function nonAkademik(): static
    {
        return $this->state(fn (array $attr) => [
            'name' => 'Non-Akademik',
            'slug' => 'non-akademik',
            'description' => 'Beasiswa seni, olahraga, organisasi untuk mahasiswa aktif berprestasi non-akademik.',
            'color_theme' => 'oklch(0.72 0.22 25)',
            'requirements' => 'IPK ≥3.00 • Sertifikat prestasi • Portofolio • Rekomendasi',
        ]);
    }
}
