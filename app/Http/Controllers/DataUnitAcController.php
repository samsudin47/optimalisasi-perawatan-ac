<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\DataUnitAcModel;
use Inertia\Inertia;
use App\Models\MasterAcModel;
use App\Models\MasterStatusAcModel;

class DataUnitAcController extends Controller
{
    public function index(){
        $data_unit_ac = DataUnitAcModel::with(['ac','status', 'clusterFirst', 'clusterSecond'])->paginate(10);

        return Inertia::render('DataUnitAc/Index', [
            'data_unit_ac' => $data_unit_ac
        ]);
    }

    public function create(){
        return Inertia::render('DataUnitAc/Create',[
            'list_ac' => MasterAcModel::all(),
            'list_status' => MasterStatusAcModel::all(),
        ]);
    }

    public function store(Request $request){
        $request->validate([
            'name_customer' => 'required',
            'id_ac' => 'required|exists:master_data_ac,id',
            'addrees' => 'required',
            'phone' => 'required',
            'date_service' => 'required|date',
            'cluster_first_id' => 'required',
            'cluster_second_id' => 'required',
            'merk' => 'required',
            'status_id' => 'required|exists:master_status_ac,id',
            'information' => 'nullable|string|max:255',
        ]);

        DataUnitAcModel::create($request->all());

        return redirect()->route('data-unit-ac');
    }

    public function edit(DataUnitAcModel $data_unit_ac){
        return Inertia::render('DataUnitAc/Edit', [
            'data_unit_ac' => $data_unit_ac,
            'list_ac' => MasterAcModel::all(),
            'list_status' => MasterStatusAcModel::all(),
        ]);
    }

    public function update(Request $request, DataUnitAcModel $data_unit_ac){
        $request->validate([
            'name_customer' => 'required',
            'id_ac' => 'required|exists:master_data_ac,id',
            'addrees' => 'required',
            'phone' => 'required',
            'date_service' => 'required|date',
            'cluster_first_id' => 'required',
            'cluster_second_id' => 'required',
            'merk' => 'required',
            'status_id' => 'required|exists:master_status_ac,id',
            'information' => 'nullable|string|max:255',
        ]);

        $data_unit_ac->update($request->all());

        return redirect()->route('data-unit-ac');
    }

    public function destroy(DataUnitAcModel $data_unit_ac){
        $data_unit_ac->delete();
        return redirect()->route('data-unit-ac');
    }
}
