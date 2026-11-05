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
        Schema::table('users', function (Blueprint $table) {
            $table->string('pjs_role', 50)->nullable()->after('role');
            $table->date('pjs_start_date')->nullable()->after('pjs_role');
            $table->date('pjs_end_date')->nullable()->after('pjs_start_date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['pjs_role', 'pjs_start_date', 'pjs_end_date']);
        });
    }
};

