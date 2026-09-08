<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ScholarshipSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $typeFor = fn (string $slug): string => match (true) {
            str_contains($slug, 'seni') || str_contains($slug, 'hafiz') => 'arts',
            str_contains($slug, 'atlet') => 'sports',
            str_contains($slug, 'sains') || str_contains($slug, 'inovasi') || str_contains($slug, 'digital') => 'technology',
            str_contains($slug, 'aktivis') || str_contains($slug, 'disabilitas') => 'non_academic',
            default => 'academic',
        };
        $items = [
            ['slug' => 'akademik-unggulan', 'name' => 'Beasiswa Akademik Unggulan', 'description' => 'Beasiswa flagship prestasi akademik: IPK tertinggi, publikasi, olimpiade sains. Dana penuh + biaya hidup.', 'color_theme' => 'oklch(0.86 0.19 90)', 'requirements' => 'IPK ≥3.50 • Semester 2–7 • Transkrip • Essay 500 kata • Surat aktif kuliah'],
            ['slug' => 'seni-budaya-nusantara', 'name' => 'Beasiswa Seni & Budaya Nusantara', 'description' => 'Untuk seniman tari, musik tradisional, teater, dan pelestari budaya. Portofolio panggung wajib.', 'color_theme' => 'oklch(0.72 0.22 25)', 'requirements' => 'IPK ≥3.00 • Portofolio karya • Sertifikat lomba • Video penampilan'],
            ['slug' => 'atlet-berprestasi', 'name' => 'Beasiswa Atlet Berprestasi', 'description' => 'Atlet daerah/nasional: sepak bola, bulu tangkis, atletik, e-sports. Support training camp.', 'color_theme' => 'oklch(0.75 0.15 230)', 'requirements' => 'IPK ≥3.00 • Medali/sertifikat KONI • Surat klub • Tes fisik'],
            ['slug' => 'sains-teknologi', 'name' => 'Beasiswa Sains & Teknologi', 'description' => 'Riset STEM, robotik, AI, dan publikasi jurnal. Lab grant + mentor dosen pembimbing.', 'color_theme' => 'oklch(0.78 0.18 140)', 'requirements' => 'IPK ≥3.25 • Proposal riset • GitHub/portofolio • Rekomendasi dosen'],
            ['slug' => 'aktivis-muda', 'name' => 'Beasiswa Aktivis Muda', 'description' => 'Penggerak organisasi, BEM, sosial kemasyarakatan, dan kepemimpinan kampus.', 'color_theme' => 'oklch(0.80 0.16 60)', 'requirements' => 'IPK ≥3.00 • SK organisasi • Essay kepemimpinan • Wawancara'],
            ['slug' => 'hafiz-quran', 'name' => 'Beasiswa Hafiz Quran', 'description' => 'Penghafal Al-Quran 5–30 juz. Beasiswa penuh + asrama tahfidz.', 'color_theme' => 'oklch(0.70 0.14 160)', 'requirements' => 'IPK ≥3.00 • Sertifikat tahfidz • Tes hafalan • Akhlak baik'],
            ['slug' => 'inovasi-digital', 'name' => 'Beasiswa Inovasi Digital', 'description' => 'Startup, aplikasi, konten kreator edukasi. Inkubasi + modal prototipe.', 'color_theme' => 'oklch(0.82 0.18 300)', 'requirements' => 'IPK ≥3.00 • Demo produk • Pitch deck • Akun publik'],
            ['slug' => 'disabilitas-inspiratif', 'name' => 'Beasiswa Disabilitas Inspiratif', 'description' => 'Mahasiswa disabilitas berprestasi. Aksesibilitas penuh + pendamping.', 'color_theme' => 'oklch(0.88 0.12 100)', 'requirements' => 'IPK ≥2.75 • Surat disabilitas • Essay inspiratif • Wawancara'],
            ['slug' => 'akademik', 'name' => 'Beasiswa Akademik', 'description' => 'Beasiswa prestasi akademik untuk mahasiswa IPK ≥3.00 dengan transkrip dan essay motivasi.', 'color_theme' => 'oklch(0.86 0.19 90)', 'requirements' => 'IPK ≥3.00 • Semester 1–8 • Transkrip • Surat aktif kuliah'],
            ['slug' => 'non-akademik', 'name' => 'Beasiswa Non-Akademik', 'description' => 'Beasiswa seni, olahraga, organisasi untuk mahasiswa aktif berprestasi non-akademik.', 'color_theme' => 'oklch(0.72 0.22 25)', 'requirements' => 'IPK ≥3.00 • Sertifikat prestasi • Portofolio • Rekomendasi'],
        ];
        foreach ($items as $row) {
            $row['type'] = $typeFor($row['slug']);
            \App\Models\Scholarship::updateOrCreate(['slug' => $row['slug']], $row);
        }
    }
}
