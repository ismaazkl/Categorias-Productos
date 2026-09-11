<?php
use App\Http\Controllers\CategoriasController;
use App\Http\Controllers\GruposController;

use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');
Route::get('/categorias/reporte-pdf', [CategoriasController::class, 'generarPdf'])
->name('categorias.pdf');
Route::resource ('categorias', CategoriasController::class);
Route::resource ('grupos', GruposController::class);
Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    
});

require __DIR__.'/settings.php';
