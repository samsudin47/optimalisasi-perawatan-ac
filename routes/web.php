<?php

use App\Http\Controllers\CentroidProsesController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\UserController;
use App\Http\Controllers\MasterAcController;
use App\Http\Controllers\MasterClusteringController;
use App\Http\Controllers\DataUnitAcController;

Route::get('/', function () {
    return redirect()->route('login');
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware(['auth'])->group(function(){
    Route::get('/users', [UserController::class, 'index'])->name('users');
    Route::get('/users/create', [UserController::class, 'create'])->name('users.create');
    Route::post('/users/store', [UserController::class, 'store'])->name('users.store');
    Route::get('/users/edit/{user}', [UserController::class, 'edit'])->name('users.edit');
    Route::patch('/users/update/{user}', [UserController::class, 'update'])->name('users.update');
});

Route::middleware(['auth'])->group(function(){
    Route::get('/master-ac', [MasterAcController::class, 'index'])->name('master-ac');
    Route::get('/master-ac/create', [MasterAcController::class, 'create'])->name('master-ac.create');
    Route::post('/master-ac/store', [MasterAcController::class, 'store'])->name('master-ac.store');
    Route::get('/master-ac/edit/{master_data_ac}', [MasterAcController::class, 'edit'])->name('master-ac.edit');
    Route::patch('/master-ac/update/{master_data_ac}', [MasterAcController::class, 'update'])->name('master-ac.update');
    Route::delete('/master-ac/delete/{masterAc}', [MasterAcController::class, 'destroy'])->name('master-ac.destroy');
});

Route::middleware(['auth'])->group(function(){
    Route::get('/master-clustering', [MasterClusteringController::class, 'index'])->name('master-clustering');
    Route::get('/master-clustering/create', [MasterClusteringController::class, 'create'])->name('master-clustering.create');
    Route::post('/master-clustering/store', [MasterClusteringController::class, 'store'])->name('master-clustering.store');
    Route::get('/master-clustering/edit/{master_clustering}', [MasterClusteringController::class, 'edit'])->name('master-clustering.edit');
    Route::patch('/master-clustering/update/{master_clustering}', [MasterClusteringController::class, 'update'])->name('master-clustering.update');
    Route::delete('/master-clustering/delete/{master_clustering}', [MasterClusteringController::class, 'destroy'])->name('master-clustering.destroy');
});

Route::middleware(['auth'])->group(function(){
    Route::get('/data-unit-ac', [DataUnitAcController::class, 'index'])->name('data-unit-ac');
    Route::get('/data-unit-ac/create', [DataUnitAcController::class, 'create'])->name('data-unit-ac.create');
    Route::post('/data-unit-ac/store', [DataUnitAcController::class, 'store'])->name('data-unit-ac.store');
    Route::get('/data-unit-ac/edit/{data_unit_ac}', [DataUnitAcController::class, 'edit'])->name('data-unit-ac.edit');
    Route::patch('/data-unit-ac/update/{data_unit_ac}', [DataUnitAcController::class, 'update'])->name('data-unit-ac.update');
    Route::delete('/data-unit-ac/delete/{data_unit_ac}', [DataUnitAcController::class, 'destroy'])->name('data-unit-ac.destroy');
});

Route::middleware(['auth'])->group(function(){
    Route::get('/clustering', [CentroidProsesController::class, 'index'])->name('clustering');
    // Route::get('/data-unit-ac/create', [DataUnitAcController::class, 'create'])->name('data-unit-ac.create');
    // Route::post('/data-unit-ac/store', [DataUnitAcController::class, 'store'])->name('data-unit-ac.store');
    // Route::get('/data-unit-ac/edit/{data_unit_ac}', [DataUnitAcController::class, 'edit'])->name('data-unit-ac.edit');
    // Route::patch('/data-unit-ac/update/{data_unit_ac}', [DataUnitAcController::class, 'update'])->name('data-unit-ac.update');
    // Route::delete('/data-unit-ac/delete/{data_unit_ac}', [DataUnitAcController::class, 'destroy'])->name('data-unit-ac.destroy');
});


Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
