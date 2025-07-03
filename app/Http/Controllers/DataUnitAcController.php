<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\DataUnitAcModel;
use Inertia\Inertia;
use App\Models\MasterAcModel;
use App\Models\MasterStatusAcModel;

class DataUnitAcController extends Controller
{
    public function index(Request $request){
        $query = DataUnitAcModel::with(['ac','status', 'clusterFirst', 'clusterSecond']);

        if ($request->bulan) {
            $query->whereMonth('date_service', $request->bulan);
        }
        if ($request->tahun) {
            $query->whereYear('date_service', $request->tahun);
        }

        $data_unit_ac = $query->paginate(10)->appends($request->all());

        // List tahun dari data
        $list_tahun = DataUnitAcModel::selectRaw('YEAR(date_service) as tahun')->distinct()->pluck('tahun');
        $list_bulan = collect(range(1,12))->map(function($m){ return str_pad($m,2,'0',STR_PAD_LEFT); });

        return Inertia::render('DataUnitAc/Index', [
            'data_unit_ac' => $data_unit_ac,
            'filter' => [
                'bulan' => $request->bulan,
                'tahun' => $request->tahun,
            ],
            'list_bulan' => $list_bulan,
            'list_tahun' => $list_tahun,
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
