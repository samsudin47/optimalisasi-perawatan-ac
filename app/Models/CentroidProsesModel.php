<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\DataUnitAcModel;

class CentroidProsesModel extends Model
{
    protected $table = 'first_centroid_process';
    protected $primaryKey = 'id';
    public function data_unit_ac()
    {
        return $this->belongsTo(DataUnitAcModel::class, 'code_ac_id');
    }
    protected $fillable = [
        'code_ac_id',
        'result_first_cluster',
        'result_second_cluster',
        'closest_distance',
        'summary_cluster',
    ];
}
