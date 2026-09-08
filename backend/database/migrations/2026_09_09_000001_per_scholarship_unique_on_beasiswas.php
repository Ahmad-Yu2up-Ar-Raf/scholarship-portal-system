<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Keep rows that would violate the new composite key (first wins).
        $dupes = DB::table('beasiswas')
            ->select('user_id')
            ->whereNotNull('user_id')
            ->groupBy('user_id', 'scholarship_id')
            ->havingRaw('COUNT(*) > 1')
            ->get();

        foreach ($dupes as $dupe) {
            $ids = DB::table('beasiswas')
                ->where('user_id', $dupe->user_id)
                ->orderBy('id')
                ->pluck('id');
            $ids->shift();
            DB::table('beasiswas')->whereIn('id', $ids)->delete();
        }

        Schema::table('beasiswas', function (Blueprint $table) {
            try {
                $table->dropUnique(['user_id']);
            } catch (\Throwable) {
                // SQLite or already dropped — continue.
            }
        });

        Schema::table('beasiswas', function (Blueprint $table) {
            $table->unique(['user_id', 'scholarship_id'], 'beasiswas_user_scholarship_unique');
        });
    }

    public function down(): void
    {
        Schema::table('beasiswas', function (Blueprint $table) {
            $table->dropUnique('beasiswas_user_scholarship_unique');
            $table->unique('user_id');
        });
    }
};
