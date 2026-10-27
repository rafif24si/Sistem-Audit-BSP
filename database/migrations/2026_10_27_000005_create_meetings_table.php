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
        Schema::create('meetings', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->enum('meeting_type', ['Entry Meeting', 'Exit Meeting', 'Rapat Internal SPI', 'Rapat Pimpinan']);
            $table->date('meeting_date');
            $table->time('start_time');
            $table->time('end_time')->nullable();
            $table->string('location');
            $table->json('invitees');
            $table->longText('discussion_points')->nullable();
            $table->longText('decisions')->nullable();
            $table->enum('confidentiality', ['Biasa', 'Terbatas', 'Rahasia'])->default('Terbatas');
            $table->enum('status', ['Terjadwal', 'Berlangsung', 'Selesai', 'Dibatalkan'])->default('Terjadwal');
            $table->string('attachment_path')->nullable();
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
        Schema::dropIfExists('meetings');
    }
};
