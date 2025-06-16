<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MasterAcModel extends Model
{
    protected $table = "master_data_ac";
    protected $primaryKey = "id";
    protected $fillable = [
        'code_ac',
        'merk',
        'type',
        'created_at',
        'updated_at',
    ];
}
