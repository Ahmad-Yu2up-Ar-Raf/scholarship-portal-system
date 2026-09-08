<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class BeasiswaRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'nama' => ['required', 'string', 'min:3', 'max:100'],
            'email' => ['required', 'email', 'max:255'],
            'hp' => ['required', 'regex:/^[0-9]+$/', 'min:10', 'max:15'],
            'semester' => ['required', 'integer', 'between:1,8'],
            'ipk' => ['required', 'numeric', 'between:0,4'],
            'beasiswa' => ['nullable', 'string', 'max:100'],
            'scholarship_id' => ['nullable', 'exists:scholarships,id'],
            'asal_sekolah' => ['required', 'string', 'min:3', 'max:100'],
            'nomor_telepon' => ['nullable', 'regex:/^[0-9+]+$/', 'min:10', 'max:16'],
            'tanggal_lahir' => ['nullable', 'date', 'before:today'],
            'kota_domisili' => ['nullable', 'string', 'min:3', 'max:100'],
            'catatan' => ['required', 'string', 'min:20', 'max:2000'],
            'photo' => ['nullable', 'image', 'mimes:jpg,jpeg,png', 'max:2048'],
            'berkas' => ['nullable', 'file', 'mimes:pdf,zip', 'max:5120'],
        ];
    }

    public function messages(): array
    {
        return [
            'nama.required' => 'Nama wajib diisi',
            'email.email' => 'Format email tidak valid',
            'hp.regex' => 'Nomor HP hanya boleh angka',
            'semester.between' => 'Semester harus antara 1-8',
            'berkas.mimes' => 'Berkas hanya boleh pdf atau zip',
            'berkas.max' => 'Ukuran berkas maksimal 5MB',
            'photo.image' => 'Foto harus berupa gambar',
            'photo.mimes' => 'Foto hanya jpg/jpeg/png',
            'asal_sekolah.required' => 'Asal sekolah wajib diisi',
            'catatan.required' => 'Ceritakan alasan layak menerima beasiswa (min 20 karakter)',
        ];
    }
}
