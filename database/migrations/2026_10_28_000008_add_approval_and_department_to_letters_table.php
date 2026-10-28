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
        Schema::table('letters', function (Blueprint $table) {
            $table->foreignId('recipient_department_id')
                ->nullable()
                ->after('recipient')
                ->constrained('departments')
                ->nullOnDelete();

            $table->enum('approval_status', ['draft', 'pending_approval', 'approved', 'rejected'])
                ->default('approved')
                ->after('confidentiality');

            $table->foreignId('approved_by')
                ->nullable()
                ->after('approval_status')
                ->constrained('users')
                ->nullOnDelete();

            $table->text('approval_notes')
                ->nullable()
                ->after('approved_by');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('letters', function (Blueprint $table) {
            $table->dropForeign(['recipient_department_id']);
            $table->dropForeign(['approved_by']);
            $table->dropColumn([
                'recipient_department_id',
                'approval_status',
                'approved_by',
                'approval_notes',
            ]);
        });
    }
};
