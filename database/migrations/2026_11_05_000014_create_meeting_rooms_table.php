<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('meeting_rooms', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->unsignedInteger('capacity')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->softDeletes();
        });

        // Seed data awal ruang rapat resmi PT BSP
        $now = now();
        DB::table('meeting_rooms')->insert([
            [
                'name' => 'Ruang Rapat SPI Lantai 3',
                'capacity' => 15,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'name' => 'Ruang Rapat Komite Audit Lt. 6',
                'capacity' => 25,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'name' => 'Ruang Rapat Utama Gedung Surya Dumai',
                'capacity' => 50,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'name' => 'Ruang Rapat Camp Zamrud (Lapangan)',
                'capacity' => 20,
                'created_at' => $now,
                'updated_at' => $now,
            ],
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('meeting_rooms');
    }
};

