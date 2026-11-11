<?php

use App\Models\Beasiswa;
use App\Models\Scholarship;
use App\Models\User;
use Laravel\Sanctum\Sanctum;

test('guests cannot view their scholarship history', function () {
    $this->getJson('/api/v1/my-beasiswa')->assertUnauthorized();
});

test('a user sees only their own applications across every status', function () {
    $user = User::factory()->create();
    $otherUser = User::factory()->create();
    $statuses = ['belum di verifikasi', 'lulus verifikasi', 'ditolak'];
    $scholarships = [
        Scholarship::factory()->akademik()->create(),
        Scholarship::factory()->nonAkademik()->create(),
        Scholarship::factory()->create(['name' => 'Beasiswa Prestasi', 'slug' => 'beasiswa-prestasi']),
    ];

    $applications = collect($statuses)->map(fn (string $status, int $index) => Beasiswa::factory()->create([
        'user_id' => $user->id,
        'scholarship_id' => $scholarships[$index]->id,
        'beasiswa' => $scholarships[$index]->slug,
        'status_ajuan' => $status,
    ]));

    Beasiswa::factory()->create([
        'user_id' => $otherUser->id,
        'scholarship_id' => $scholarships[0]->id,
        'beasiswa' => $scholarships[0]->slug,
        'email' => 'other@example.com',
    ]);

    Sanctum::actingAs($user);

    $response = $this->getJson('/api/v1/my-beasiswa')
        ->assertOk()
        ->assertJsonCount(3, 'data')
        ->assertJsonMissing(['email' => 'other@example.com'])
        ->assertJsonMissingPath('data.0.photo_path')
        ->assertJsonMissingPath('data.0.photo_url')
        ->assertJsonStructure([
            'data' => [
                '*' => ['id', 'nama', 'semester', 'ipk', 'berkas_url', 'status_ajuan', 'created_at', 'scholarship'],
            ],
        ]);

    expect(collect($response->json('data'))->pluck('user_id')->unique()->all())
        ->toBe([$user->id])
        ->and(collect($response->json('data'))->pluck('status_ajuan')->sort()->values()->all())
        ->toBe(collect($statuses)->sort()->values()->all())
        ->and(collect($response->json('data'))->pluck('id')->all())
        ->toEqualCanonicalizing($applications->pluck('id')->all());
});
