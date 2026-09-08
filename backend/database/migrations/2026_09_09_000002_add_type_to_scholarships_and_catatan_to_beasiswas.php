<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('scholarships', function (Blueprint $table) {
            $table->string('type')->nullable()->after('slug');
        });

        Schema::table('beasiswas', function (Blueprint $table) {
            $table->text('catatan')->nullable()->after('asal_sekolah');
        });
    }

    public function down(): void
    {
        Schema::table('beasiswas', function (Blueprint $table) {
            $table->dropColumn('catatan');
        });

        Schema::table('scholarships', function (Blueprint $table) {
            $table->dropColumn('type');
        });
    }
};
