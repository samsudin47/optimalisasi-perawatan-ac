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
            $table->foreign('status_id')->on('master_status_ac')->references('id')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('data_unit_ac', function (Blueprint $table) {
            $table->dropForeign(['status_id']);
        });
    }
};
