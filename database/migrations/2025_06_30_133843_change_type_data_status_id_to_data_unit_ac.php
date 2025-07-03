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
        Schema::table('data_unit_ac', function (Blueprint $table) {
            $table->unsignedBigInteger('status_id')->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('data_unit_ac', function (Blueprint $table) {
            $table->dropColumn(['status_id']);
        });
    }
};
