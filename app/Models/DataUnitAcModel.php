<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\MasterAcModel;
use Illuminate\Database\Eloquent\SoftDeletes;

class DataUnitAcModel extends Model
{
    use SoftDeletes;
    protected $table = 'data_unit_ac';
    protected $primaryKey = 'id';

        public function ac()
    {
        return $this->belongsTo(MasterAcModel::class, 'id_ac');
    }
    public function status()
    {
        return $this->belongsTo(MasterStatusAcModel::class, 'status_id');
    }
    public function clusterFirst()
    {
        return $this->belongsTo(MasterClusteringModel::class, 'cluster_first_id');
    }
    public function clusterSecond()
    {
        return $this->belongsTo(MasterClusteringModel::class, 'cluster_second_id');
    }

    protected $fillable = [
        'name_customer',
        'id_ac',
        'addrees',
        'phone',
        'date_service',
        'cluster_first_id',
        'cluster_second_id',
        'merk',
        'status_id',
        'information',
        'deleted_at',
    ];

}
