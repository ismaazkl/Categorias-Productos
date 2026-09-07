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
        Schema::table('Productos', function (Blueprint $table) {
            if (!Schema::hasColumn('Productos', 'grupo_id')) {
                $table->foreignId('grupo_id')->nullable()->after('cat')->constrained('grupos')->onDelete('set null');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('Productos', function (Blueprint $table) {
            $table->dropConstrainedForeignId('grupo_id');
        });
    }
};
