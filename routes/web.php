<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\UserController;
use App\Http\Controllers\MasterAcController;

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
    Route::get('/master-ac/edit/{masterAc}', [MasterAcController::class, 'edit'])->name('master-ac.edit');
    Route::patch('/master-ac/update/{masterAc}', [MasterAcController::class, 'update'])->name('master-ac.update');
    Route::delete('/master-ac/delete/{masterAc}', [MasterAcController::class, 'destroy'])->name('master-ac.destroy');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
