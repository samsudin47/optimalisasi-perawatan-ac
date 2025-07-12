<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class FirstIterationController extends Controller
{
    public function index(){
        return inertia('ClusteringData/Index');
    }
}
