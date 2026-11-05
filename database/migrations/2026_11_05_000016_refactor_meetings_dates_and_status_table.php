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
        // 1. Ubah status data lama 'Berlangsung' menjadi 'Terjadwal' agar tidak error saat alter enum
        DB::table('meetings')->where('status', 'Berlangsung')->update(['status' => 'Terjadwal']);

        Schema::table('meetings', function (Blueprint $table) {
            // 2. Rename meeting_date menjadi meeting_date_start
            $table->renameColumn('meeting_date', 'meeting_date_start');
        });

        Schema::table('meetings', function (Blueprint $table) {
            // 3. Tambah meeting_date_end (nullable)
            $table->date('meeting_date_end')->nullable()->after('meeting_date_start');
        });

        // 4. Ubah enum status menjadi hanya: Terjadwal, Selesai, Dibatalkan
        DB::statement("ALTER TABLE `meetings` MODIFY COLUMN `status` ENUM('Terjadwal', 'Selesai', 'Dibatalkan') NOT NULL DEFAULT 'Terjadwal'");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement("ALTER TABLE `meetings` MODIFY COLUMN `status` ENUM('Terjadwal', 'Berlangsung', 'Selesai', 'Dibatalkan') NOT NULL DEFAULT 'Terjadwal'");

        Schema::table('meetings', function (Blueprint $table) {
            $table->dropColumn('meeting_date_end');
            $table->renameColumn('meeting_date_start', 'meeting_date');
        });
    }
};
