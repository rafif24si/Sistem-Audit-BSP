<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Ubah meeting_type pada meetings dari ENUM menjadi VARCHAR(255) agar dinamis sesuai master meeting_types
        DB::statement("ALTER TABLE `meetings` MODIFY COLUMN `meeting_type` VARCHAR(255) NOT NULL DEFAULT 'Entry Meeting'");

        // Ubah category pada kpis dari ENUM menjadi VARCHAR(255) agar dinamis sesuai master kpi_categories
        DB::statement("ALTER TABLE `kpis` MODIFY COLUMN `category` VARCHAR(255) NOT NULL DEFAULT 'Operasional Audit'");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement("ALTER TABLE `meetings` MODIFY COLUMN `meeting_type` ENUM('Entry Meeting', 'Exit Meeting', 'Rapat Internal SPI', 'Rapat Pimpinan') NOT NULL DEFAULT 'Entry Meeting'");
        DB::statement("ALTER TABLE `kpis` MODIFY COLUMN `category` ENUM('Operasional Audit', 'Kepatuhan & Tata Kelola', 'Administrasi & Pelaporan', 'Pengembangan SDM') NOT NULL DEFAULT 'Operasional Audit'");
    }
};

