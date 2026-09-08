<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('beasiswas', function (Blueprint $table) {
            $table->id();
            $table->string('nama', 100);
            $table->string('email', 255)->index();
            $table->string('hp', 15);
            $table->tinyInteger('semester')->unsigned();
            $table->decimal('ipk', 3, 2);
            $table->string('beasiswa')->nullable();
            $table->string('berkas_path')->nullable();
            $table->string('status_ajuan')->default('belum di verifikasi');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('beasiswas');
    }
};
