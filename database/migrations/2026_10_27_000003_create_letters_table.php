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
        Schema::create('letters', function (Blueprint $table) {
            $table->id();
            $table->string('agenda_number', 100)->nullable();
            $table->string('letter_number', 100)->unique();
            $table->enum('scope', ['internal', 'external']);
            $table->enum('direction', ['incoming', 'outgoing']);
            $table->enum('letter_type_code', ['ST', 'PA', 'DT', 'KF', 'TL', 'KS', 'KP', 'UM', 'LHA', 'LAP'])->nullable();
            $table->string('subject');
            $table->string('sender');
            $table->string('recipient');
            $table->date('letter_date');
            $table->date('received_date')->nullable();
            $table->enum('confidentiality', ['Biasa', 'Terbatas', 'Rahasia', 'Sangat Rahasia'])->default('Terbatas');
            $table->string('file_path')->nullable();
            $table->enum('followup_status', ['not_required', 'pending', 'in_progress', 'completed'])->default('not_required');
            $table->text('followup_notes')->nullable();
            $table->date('followup_due_date')->nullable();
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
        Schema::dropIfExists('letters');
    }
};
