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
        DB::statement("ALTER TABLE `meetings` MODIFY COLUMN `platform` ENUM('Tatap Muka', 'Zoom', 'Google Meet', 'Microsoft Teams', 'Webex') NULL DEFAULT 'Tatap Muka'");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement("ALTER TABLE `meetings` MODIFY COLUMN `platform` ENUM('Tatap Muka', 'Zoom', 'Google Meet', 'Microsoft Teams') NULL DEFAULT 'Tatap Muka'");
    }
};

