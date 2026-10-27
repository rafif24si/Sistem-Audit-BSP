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
        Schema::create('master_documents', function (Blueprint $table) {
            $table->id();
            $table->string('document_number', 100)->unique();
            $table->string('title');
            $table->foreignId('department_id')->constrained('departments')->cascadeOnDelete();
            $table->enum('document_type', ['MAN', 'SOP', 'WI', 'FORM']);
            $table->string('version', 10)->default('00');
            $table->date('effective_date');
            $table->date('expired_date')->nullable();
            $table->enum('control_status', ['TERKENDALI', 'TIDAK_TERKENDALI', 'KADALUARSA'])->default('TERKENDALI');
            $table->enum('confidentiality', ['Biasa', 'Terbatas', 'Rahasia', 'Sangat Rahasia'])->default('Terbatas');
            $table->string('file_path');
            $table->foreignId('created_by')->constrained('users')->cascadeOnDelete();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('master_documents');
    }
};
