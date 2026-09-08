<?php

namespace App\Http\Controllers;

use App\Http\Requests\BeasiswaRequest;
use App\Http\Resources\BeasiswaResource;
use App\Models\Beasiswa;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class BeasiswaController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Beasiswa::with('scholarship');

        if ($search = $request->query('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('nama', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('asal_sekolah', 'like', "%{$search}%");
            });
        }

        if ($status = $request->query('status')) {
            $query->where('status_ajuan', $status);
        }

        $sort = $request->query('sort', 'latest');
        if ($sort === 'ipk_desc') {
            $query->orderByDesc('ipk')->orderByDesc('created_at');
        } else {
            $query->orderByDesc('created_at');
        }

        $perPage = max(1, min(50, (int) $request->query('per_page', 50)));
        $paginated = $query->paginate($perPage);

        return response()->json([
            'data' => BeasiswaResource::collection($paginated->items()),
            'meta' => [
                'current_page' => $paginated->currentPage(),
                'per_page' => $paginated->perPage(),
                'total' => $paginated->total(),
                'last_page' => $paginated->lastPage(),
            ],
        ]);
    }

    public function store(BeasiswaRequest $request): JsonResponse
    {
        $validated = $request->validated();

        // Enforce 1 registration per (user, scholarship) — users may apply
        // to many DIFFERENT scholarships, but never the same one twice.
        $user = $request->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated. Silakan login.'], 401);
        }

        // Resolve scholarship_id from beasiswa string if not provided
        $scholarshipId = $validated['scholarship_id'] ?? null;
        if (!$scholarshipId && !empty($validated['beasiswa'])) {
            $scholarship = \App\Models\Scholarship::where('slug', $validated['beasiswa'])->orWhere('name', $validated['beasiswa'])->first();
            $scholarshipId = $scholarship?->id;
        }
        if (!$scholarshipId) {
            return response()->json(['message' => 'scholarship_id wajib diisi.', 'errors' => ['scholarship_id' => ['Pilih beasiswa.']]], 422);
        }

        $exists = Beasiswa::where('user_id', $user->id)
            ->where('scholarship_id', $scholarshipId)
            ->exists();
        if ($exists) {
            return response()->json(['message' => 'Anda sudah terdaftar pada beasiswa ini.'], 422);
        }

        $berkasPath = null;
        if ($request->hasFile('berkas')) {
            $berkasPath = $request->file('berkas')->store('berkas', 'public');
        }
        $photoPath = null;
        if ($request->hasFile('photo')) {
            $photoPath = $request->file('photo')->store('photos', 'public');
        }

        $beasiswa = Beasiswa::create([
            'nama' => $validated['nama'],
            'email' => $validated['email'],
            'hp' => $validated['hp'],
            'semester' => $validated['semester'],
            'ipk' => $validated['ipk'],
            'beasiswa' => $validated['beasiswa'] ?? null,
            'scholarship_id' => $scholarshipId,
            'user_id' => $user?->id,
            'asal_sekolah' => $validated['asal_sekolah'] ?? null,
            'catatan' => $validated['catatan'] ?? null,
            'photo_path' => $photoPath,
            'berkas_path' => $berkasPath,
            'status_ajuan' => 'belum di verifikasi',
        ]);

        return response()->json([
            'data' => new BeasiswaResource($beasiswa),
            'message' => 'Pendaftaran beasiswa berhasil',
        ], 201);
    }

    public function show(Beasiswa $beasiswa): JsonResponse
    {
        return response()->json([
            'data' => new BeasiswaResource($beasiswa),
        ]);
    }
}
