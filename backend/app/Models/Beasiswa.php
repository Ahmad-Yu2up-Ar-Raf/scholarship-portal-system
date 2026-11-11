<?php

namespace App\Models;

use Database\Factories\BeasiswaFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Beasiswa extends Model
{
    /** @use HasFactory<BeasiswaFactory> */
    use HasFactory;

    protected $fillable = [
        'nama',
        'email',
        'hp',
        'semester',
        'ipk',
        'beasiswa',
        'scholarship_id',
        'user_id',
        'asal_sekolah',
        'nomor_telepon',
        'tanggal_lahir',
        'kota_domisili',
        'catatan',
        'berkas_path',
        'status_ajuan',
    ];

    protected $casts = [
        'semester' => 'integer',
        'ipk' => 'decimal:2',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function scholarship()
    {
        return $this->belongsTo(Scholarship::class);
    }
}
