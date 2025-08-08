<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ThirdIterationModel extends Model
{
    protected $table = 'third_centroid_process';
    protected $primaryKey = 'id';


    public function data_unit_ac()
    {
        return $this->belongsTo(DataUnitAcModel::class, 'code_ac_id');
    }
    public function cluster_first()
    {
        return $this->belongsTo(DataUnitAcModel::class, 'cluster_first_id');
    }
    public function cluster_second()
    {
        return $this->belongsTo(DataUnitAcModel::class, 'cluster_second_id');
    }
     protected $fillable = [
        'code_ac_id',
        'cluster_first_id',
        'cluster_second_id',
        'result_first_cluster',
        'result_second_cluster',
        'closest_distance',
        'summary_cluster',
    ];
}
