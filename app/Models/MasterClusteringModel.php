<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MasterClusteringModel extends Model
{
    protected $table = "master_clustering";
    protected $primaryKey = "id";
    protected $fillable = [
        'code_clustering',
        'information',
        'description',
        'created_at',
        'updated_at',
    ];

}
