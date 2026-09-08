<?php

namespace Database\Seeders;

use App\Models\Beasiswa;
use Illuminate\Database\Seeder;

class BeasiswaSeeder extends Seeder
{
    public function run(): void
    {
        $akademik = \App\Models\Scholarship::where('slug', 'akademik')->first();
        $nonAkademik = \App\Models\Scholarship::where('slug', 'non-akademik')->first();

        $data = [
            ["nama" => "Ahmad Fauzi", "email" => "ahmad.fauzi@gmail.com", "hp" => "081234567890", "semester" => 5, "ipk" => 3.75, "beasiswa" => "akademik", "scholarship_id" => $akademik?->id, "asal_sekolah" => "SMA Negeri 1 Jakarta", "photo_path" => null, "status_ajuan" => "lulus verifikasi"],
            ["nama" => "Siti Nurhaliza", "email" => "siti.nurhaliza@yahoo.co.id", "hp" => "082345678901", "semester" => 3, "ipk" => 3.92, "beasiswa" => "akademik", "scholarship_id" => $akademik?->id, "asal_sekolah" => "SMA Negeri 3 Bandung", "photo_path" => null, "status_ajuan" => "lulus verifikasi"],
            ["nama" => "Budi Santoso", "email" => "budi.santoso@gmail.com", "hp" => "083456789012", "semester" => 7, "ipk" => 3.45, "beasiswa" => "non_akademik", "scholarship_id" => $nonAkademik?->id, "asal_sekolah" => "SMK Telkom Malang", "photo_path" => null, "status_ajuan" => "belum di verifikasi"],
            ["nama" => "Dewi Lestari", "email" => "dewi.lestari@gmail.com", "hp" => "084567890123", "semester" => 2, "ipk" => 2.90, "beasiswa" => "akademik", "scholarship_id" => $akademik?->id, "asal_sekolah" => "SMA Negeri 5 Surabaya", "photo_path" => null, "status_ajuan" => "ditolak"],
            ["nama" => "Rizky Pratama", "email" => "rizky.pratama@gmail.com", "hp" => "085678901234", "semester" => 6, "ipk" => 3.60, "beasiswa" => "non_akademik", "scholarship_id" => $nonAkademik?->id, "asal_sekolah" => "SMA Negeri 2 Yogyakarta", "photo_path" => null, "status_ajuan" => "belum di verifikasi"],
            ["nama" => "Maya Sari", "email" => "maya.sari@gmail.com", "hp" => "086789012345", "semester" => 4, "ipk" => 3.85, "beasiswa" => "akademik", "scholarship_id" => $akademik?->id, "asal_sekolah" => "SMA Negeri 1 Bogor", "photo_path" => null, "status_ajuan" => "lulus verifikasi"],
            ["nama" => "Eko Wijaya", "email" => "eko.wijaya@gmail.com", "hp" => "087890123456", "semester" => 8, "ipk" => 3.20, "beasiswa" => "non_akademik", "scholarship_id" => $nonAkademik?->id, "asal_sekolah" => "SMK Negeri 1 Bekasi", "photo_path" => null, "status_ajuan" => "belum di verifikasi"],
            ["nama" => "Lina Marlina", "email" => "lina.marlina@gmail.com", "hp" => "088901234567", "semester" => 1, "ipk" => 3.95, "beasiswa" => "akademik", "scholarship_id" => $akademik?->id, "asal_sekolah" => "SMA Negeri 8 Jakarta", "photo_path" => null, "status_ajuan" => "lulus verifikasi"],
            ["nama" => "Joko Widodo", "email" => "joko.widodo@gmail.com", "hp" => "089012345678", "semester" => 5, "ipk" => 3.10, "beasiswa" => "non_akademik", "scholarship_id" => $nonAkademik?->id, "asal_sekolah" => "SMA Negeri 1 Solo", "photo_path" => null, "status_ajuan" => "ditolak"],
            ["nama" => "Ani Yudhoyono", "email" => "ani.yudhoyono@gmail.com", "hp" => "081234567891", "semester" => 6, "ipk" => 3.55, "beasiswa" => "akademik", "scholarship_id" => $akademik?->id, "asal_sekolah" => "SMA Negeri 1 Malang", "photo_path" => null, "status_ajuan" => "belum di verifikasi"],
        ];

        foreach ($data as $row) {
            $user = \App\Models\User::firstOrCreate(
                ['email' => $row['email']],
                ['name' => $row['nama'], 'password' => bcrypt('password')]
            );
            Beasiswa::firstOrCreate(
                ['email' => $row['email']],
                [
                    "nama" => $row["nama"],
                    "hp" => $row["hp"],
                    "semester" => $row["semester"],
                    "ipk" => $row["ipk"],
                    "beasiswa" => $row["beasiswa"],
                    "scholarship_id" => $row["scholarship_id"],
                    "user_id" => $user->id,
                    "asal_sekolah" => $row["asal_sekolah"],
                    "photo_path" => $row["photo_path"],
                    "berkas_path" => "berkas/contoh_".strtolower(str_replace(" ", "_", $row["nama"])).".pdf",
                    "status_ajuan" => $row["status_ajuan"],
                ]
            );
        }
    }
}
