<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Ubah platform pada tabel meetings dari ENUM menjadi VARCHAR(255) nullable
        DB::statement("ALTER TABLE `meetings` MODIFY COLUMN `platform` VARCHAR(255) NULL DEFAULT 'Tatap Muka'");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement("ALTER TABLE `meetings` MODIFY COLUMN `platform` ENUM('Tatap Muka', 'Zoom', 'Google Meet', 'Microsoft Teams', 'Webex') NULL DEFAULT 'Tatap Muka'");
    }
};

