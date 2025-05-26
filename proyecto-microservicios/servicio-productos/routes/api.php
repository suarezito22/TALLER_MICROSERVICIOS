<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\VehiculoController;
use App\Http\Controllers\ClienteController;
use App\Http\Controllers\ReservaController;

// Rutas API RESTful
Route::apiResource('reservas', ReservaController::class);
Route::apiResource('clientes', ClienteController::class);
Route::apiResource('vehiculos', VehiculoController::class);

// Ruta de usuario autenticado (opcional si no usas Sanctum)
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
