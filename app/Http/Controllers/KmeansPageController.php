<?php

namespace App\Http\Controllers;

class KmeansPageController extends Controller
{
    public function Index(){
        return inertia('ClusteringData/Index');
    }
}
