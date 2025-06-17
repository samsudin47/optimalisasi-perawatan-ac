<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\MasterClusteringModel;
use Inertia\Inertia;

class MasterClusteringController extends Controller
{
    public function index(){
        $master_clustering = MasterClusteringModel::paginate(10);

        return Inertia::render('MasterClustering/Index', [
            'master_clustering' => $master_clustering,
        ]);
    }

    public function create(){
        return Inertia::render('MasterClustering/Create');
    }

    public function store(Request $request){
        $request->validate([
            'code_clustering' => 'required|unique:master_clustering,code_clustering',
            'information' => 'nullable',
            'description' => 'nullable',
        ]);

        MasterClusteringModel::create($request->all());
        return redirect()->route('master-clustering');
    }

    public function edit(MasterClusteringModel $master_clustering){
        return Inertia::render('MasterClustering/Edit', [
            'master_clustering' => $master_clustering
        ]);
    }
    public function update(Request $request, MasterClusteringModel $master_clustering){
        $request->validate([
            'code_clustering' => 'required|unique:master_clustering,code_clustering,'.$master_clustering->id,
            'information' => 'nullable',
            'description' => 'nullable',
        ]);

        $master_clustering->update($request->all());

        return redirect()->route('master-clustering');
    }
    public function destroy(MasterClusteringModel $master_clustering){
        $master_clustering->delete();
        return redirect()->route('master-clustering');
    }
}
