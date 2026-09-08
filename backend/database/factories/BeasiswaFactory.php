<?php

namespace Database\Factories;

use App\Models\Beasiswa;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Beasiswa>
 */
class BeasiswaFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $scholarship = \App\Models\Scholarship::inRandomOrder()->first() ?? \App\Models\Scholarship::factory()->create();
        return [
            'nama' => fake('id_ID')->name(),
            'email' => fake()->unique()->safeEmail(),
            'hp' => '08' . fake()->numerify('##########'),
            'semester' => fake()->numberBetween(1, 8),
            'ipk' => fake()->randomFloat(2, 2.90, 3.95),
            'beasiswa' => $scholarship->slug === 'akademik' ? 'akademik' : 'non_akademik',
            'scholarship_id' => $scholarship->id,
            'asal_sekolah' => fake('id_ID')->city() . ' High School',
            'nomor_telepon' => '08' . fake()->numerify('##########'),
            'tanggal_lahir' => fake()->dateTimeBetween('-25 years', '-17 years')->format('Y-m-d'),
            'kota_domisili' => fake('id_ID')->city(),
            'photo_path' => null,
            'berkas_path' => 'berkas/contoh_' . fake()->word() . '.pdf',
            'status_ajuan' => fake()->randomElement(['belum di verifikasi', 'lulus verifikasi', 'ditolak']),
        ];
    }
}
