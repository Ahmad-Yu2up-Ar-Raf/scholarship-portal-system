<?php

use App\Http\Controllers\BeasiswaController;
use App\Http\Controllers\ScholarshipController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    // Scholarships — master data (public)
    Route::get('/scholarships', [ScholarshipController::class, 'index'])->name('scholarships.index');
    Route::get('/scholarships/{scholarship}', [ScholarshipController::class, 'show'])->name('scholarships.show');

    // Beasiswa — public read, store requires auth (1 per user)
    Route::get('/beasiswa', [BeasiswaController::class, 'index'])->name('beasiswa.index');
    Route::get('/beasiswa/{beasiswa}', [BeasiswaController::class, 'show'])->name('beasiswa.show');
    Route::post('/beasiswa', [BeasiswaController::class, 'store'])->middleware('auth:sanctum')->name('beasiswa.store');

    // Auth — Sanctum SPA (uses cookies, but also supports Bearer via HasApiTokens)
    Route::post('/register', [\App\Http\Controllers\Auth\RegisteredUserController::class, 'store'])->name('api.register');
    Route::post('/login', [\App\Http\Controllers\Auth\AuthenticatedSessionController::class, 'store'])->name('api.login');
    Route::post('/logout', [\App\Http\Controllers\Auth\AuthenticatedSessionController::class, 'destroy'])->middleware('auth:sanctum')->name('api.logout');
    Route::get('/user', function (Request $request) {
        return response()->json(['data' => $request->user()]);
    })->middleware('auth:sanctum')->name('api.user');

    // Current user's applications (for per-scholarship guard)
    Route::get('/my-beasiswa', function (Request $request) {
        $user = $request->user();
        $apps = \App\Models\Beasiswa::with('scholarship')->where('user_id', $user->id)->orderByDesc('created_at')->get();
        return response()->json(['data' => \App\Http\Resources\BeasiswaResource::collection($apps)]);
    })->middleware('auth:sanctum')->name('beasiswa.my');
});
