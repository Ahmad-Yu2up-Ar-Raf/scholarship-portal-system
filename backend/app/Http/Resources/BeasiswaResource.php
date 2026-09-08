<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BeasiswaResource extends JsonResource
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
            'nama' => $this->nama,
            'email' => $this->email,
            'hp' => $this->hp,
            'semester' => $this->semester,
            'ipk' => $this->ipk,
            'beasiswa' => $this->beasiswa,
            'scholarship_id' => $this->scholarship_id,
            'scholarship' => $this->whenLoaded('scholarship'),
            'asal_sekolah' => $this->asal_sekolah,
            'nomor_telepon' => $this->nomor_telepon,
            'tanggal_lahir' => $this->tanggal_lahir,
            'kota_domisili' => $this->kota_domisili,
            'catatan' => $this->catatan,
            'photo_path' => $this->photo_path,
            'photo_url' => $this->photo_path ? asset('storage/' . $this->photo_path) : null,
            'berkas_path' => $this->berkas_path,
            'berkas_url' => $this->berkas_path ? asset('storage/' . $this->berkas_path) : null,
            'status_ajuan' => $this->status_ajuan,
            'user_id' => $this->user_id,
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
