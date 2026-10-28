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
        Schema::table('meetings', function (Blueprint $table) {
            $table->enum('meeting_mode', ['Offline', 'Online'])
                ->default('Offline')
                ->after('meeting_type');

            $table->enum('platform', ['Tatap Muka', 'Zoom', 'Google Meet', 'Microsoft Teams'])
                ->nullable()
                ->default('Tatap Muka')
                ->after('meeting_mode');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('meetings', function (Blueprint $table) {
            $table->dropColumn(['meeting_mode', 'platform']);
        });
    }
};
