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
        Schema::table('first_centroid_process', function (Blueprint $table) {
            $table->dropColumn(['cluster_first_id', 'cluster_second_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('first_centroid_process', function (Blueprint $table) {
            $table->unsignedBigInteger('cluster_first_id')->nullable();
            $table->unsignedBigInteger('cluster_second_id')->nullable();
        });
    }
};
