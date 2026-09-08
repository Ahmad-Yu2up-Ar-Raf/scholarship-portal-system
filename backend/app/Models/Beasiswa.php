<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Beasiswa extends Model
{
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
        'catatan',
        'photo_path',
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
