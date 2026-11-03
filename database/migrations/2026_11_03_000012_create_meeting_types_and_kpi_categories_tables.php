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
        Schema::create('meeting_types', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->text('description')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('kpi_categories', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->text('description')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        // Seed initial standard data
        DB::table('meeting_types')->insert([
            ['name' => 'Entry Meeting', 'description' => 'Pertemuan pembuka audit dengan auditee', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Exit Meeting', 'description' => 'Pertemuan penutup pemaparan temuan dan rekomendasi audit', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Rapat Internal SPI', 'description' => 'Koordinasi internal tim satuan pengawasan intern', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Rapat Pimpinan', 'description' => 'Rapat komite audit bersama jajaran direksi/manajemen', 'created_at' => now(), 'updated_at' => now()],
        ]);

        DB::table('kpi_categories')->insert([
            ['name' => 'Operasional Audit', 'description' => 'Indikator pelaksanaan penugasan audit dan PKPT', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Kepatuhan & Tata Kelola', 'description' => 'Indikator kepatuhan regulasi migas dan SOP internal', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Administrasi & Pelaporan', 'description' => 'Indikator kecepatan dan kualitas penerbitan LHA', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Pengembangan SDM', 'description' => 'Indikator sertifikasi dan pelatihan kompetensi auditor', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('kpi_categories');
        Schema::dropIfExists('meeting_types');
    }
};

