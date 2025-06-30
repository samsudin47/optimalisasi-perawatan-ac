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
         Schema::create('data_unit_ac', function (Blueprint $table){
            $table->id()->unique()->autoIncrement();
            $table->string('name_customer')->nullable();
            $table->unsignedBigInteger('id_ac')->nullable();
            $table->string("addrees")->nullable();
            $table->string('phone')->nullable();
            $table->date('date_service')->nullable();
            $table->unsignedBigInteger('cluster_first_id')->nullable();
            $table->unsignedBigInteger('cluster_second_id')->nullable();
            $table->string('merk')->nullable();
            $table->string('information')->nullable();
            $table->softDeletes();
            $table->timestamp('created_at')->nullable();
            $table->timestamp('updated_at')->nullable();
            // Foreign key harus dipisah agar relasi bisa dibuat dengan benar di db
            $table->foreign('id_ac')->on('master_data_ac')->references('id')->onDelete('cascade');
            $table->foreign('cluster_first_id')->on('master_clustering')->references('id')->onDelete('cascade'); // sudah tidak dipakai
            $table->foreign('cluster_second_id')->on('master_clustering')->references('id')->onDelete('cascade'); // sudah tidak dipakai
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('data_unit_ac');
    }
};
