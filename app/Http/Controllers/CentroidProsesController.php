<?php

namespace App\Http\Controllers;

use App\Models\CentroidProsesModel;
use Inertia\Inertia;

class CentroidProsesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $centroidProcess = CentroidProsesModel::with([
            'data_unit_ac.ac'
        ])->paginate(10);

        return Inertia::render('ClusteringData/Index', [
            'centroidProcess' => $centroidProcess,
        ]);
    }
}
