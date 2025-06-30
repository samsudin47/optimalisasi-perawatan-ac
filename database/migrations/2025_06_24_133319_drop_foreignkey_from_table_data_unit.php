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
            $table->dropForeign(['cluster_first_id']);
            $table->dropForeign(['cluster_second_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('data_unit_ac', function (Blueprint $table) {
            // Re-add foreign keys if needed
            $table->foreign('cluster_first_id')->on('master_clustering')->references('id')->onDelete('cascade');
            $table->foreign('cluster_second_id')->on('master_clustering')->references('id')->onDelete('cascade');
        });
    }
};
