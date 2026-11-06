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
        Schema::table('kpis', function (Blueprint $table) {
            if (Schema::hasColumn('kpis', 'period')) {
                $table->dropColumn('period');
            }
            $table->foreignId('kpi_period_id')->nullable()->after('unit')->constrained('kpi_periods')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('kpis', function (Blueprint $table) {
            $table->dropForeign(['kpi_period_id']);
            $table->dropColumn('kpi_period_id');
            $table->string('period', 50)->default('Tahun 2026')->after('unit');
        });
    }
};

