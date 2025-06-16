<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\MasterAcModel;
use Inertia\Inertia;

class MasterAcController extends Controller
{
    public function index(){
        $masterAc = MasterAcModel::paginate(10);

        return Inertia::render('MasterAc/Index', [
            'masterAc' => $masterAc,
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

    public function edit(MasterAcModel $masterAc){
        return Inertia::render('MasterAc/Edit', [
            '$masterAc' => $masterAc,
            dd($masterAc),
        ]);
    }

    public function update(Request $request, MasterAcModel $masterAc){
        $request->validate([
            'code_ac'=>'required|unique:master_data_ac,code_ac,'.$masterAc->id,
            'merk'=>'required',
            'type'=>'required',
        ]);

        $masterAc->update($request->all());

        return redirect()->route('master-ac');
    }

    public function destroy(MasterAcModel $masterAc){
        $masterAc->delete();
        return redirect()->route('masterac');
    }
}
