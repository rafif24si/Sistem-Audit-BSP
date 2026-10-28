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
        Schema::create('kpis', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->enum('category', [
                'Operasional Audit',
                'Kepatuhan & Tata Kelola',
                'Administrasi & Pelaporan',
                'Pengembangan SDM',
            ])->default('Operasional Audit');
            $table->decimal('target_value', 8, 2);
            $table->decimal('realization_value', 8, 2)->default(0);
            $table->string('unit', 50)->default('%');
            $table->string('period', 50)->default('Tahun 2026');
            $table->enum('status', [
                'Tercapai',
                'Dalam Proses',
                'Perlu Perhatian',
                'Belum Tercapai',
            ])->default('Dalam Proses');
            $table->text('notes')->nullable();
            $table->integer('order_index')->default(0);
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('kpis');
    }
};
