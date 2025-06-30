<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MasterStatusAcModel extends Model
{
    protected $table = "master_status_ac";
    protected $primaryKey = "id";
    protected $fillable = [
        'status',
        'description',
        'created_at',
        'updated_at',
    ];
}
