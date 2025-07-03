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
        Schema::create('first_centroid_process', function (Blueprint $table){
            $table->id()->unique()->autoIncrement();
            $table->unsignedBigInteger('code_ac_id');
            $table->unsignedBigInteger('cluster_first_id')->nullable();
            $table->unsignedBigInteger('cluster_second_id')->nullable();
            $table->float('result_first_cluster')->nullable();
            $table->float('result_second_cluster')->nullable();
            $table->float('closest_distance')->nullable();
            $table->string('summary_cluster')->nullable();
            $table->timestamp('created_at')->nullable();
            $table->timestamp('updated_at')->nullable();
            // Foreign key harus dipisah agar relasi bisa dibuat dengan benar di db
            $table->foreign('code_ac_id')->on('data_unit_ac')->references('id')->onDelete('cascade');
            $table->foreign('cluster_first_id')->on('data_unit_ac')->references('id')->onDelete('cascade');
            $table->foreign('cluster_second_id')->on('data_unit_ac')->references('id')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
            Schema::dropIfExists('first_centroid_process');
    }
};
