<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\MasterAcModel;
use Inertia\Inertia;

class MasterAcController extends Controller
{
    public function index(){
        $master_data_ac = MasterAcModel::paginate(10);

        return Inertia::render('MasterAc/Index', [
            'master_data_ac' => $master_data_ac,
        ]);
    }

    public function create(){
        return Inertia::render('MasterAc/Create');
    }

    public function store(Request $request){
        $request->validate([
            'code_ac'=>'required|unique:master_data_ac,code_ac',
            'merk'=>'required',
            'type'=>'required',
        ]);

        $master_data_ac = MasterAcModel::create($request->all());
        return redirect()->route('master-ac');
    }

    public function edit(MasterAcModel $master_data_ac){
        return Inertia::render('MasterAc/Edit', [
            'master_data_ac' => $master_data_ac
        ]);
    }

    public function update(Request $request, MasterAcModel $master_data_ac){
        $request->validate([
            'code_ac'=>'required|unique:master_data_ac,code_ac,'.$master_data_ac->id,
            'merk'=>'required',
            'type'=>'required',
        ]);

        $master_data_ac->update($request->all());

        return redirect()->route('master-ac');
    }
    public function destroy(MasterAcModel $master_data_ac){
        $master_data_ac->delete();
        return redirect()->route('master-ac');
    }
}
