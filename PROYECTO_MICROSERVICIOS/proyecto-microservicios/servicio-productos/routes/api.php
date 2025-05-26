<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\VehiculoController;
use App\Http\Controllers\ClienteController;
use App\Http\Controllers\ReservaController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
| Aquí se registran las rutas para consumir desde el frontend (JS, Postman, etc).
| Todas las rutas están bajo el prefijo "/api".
*/

// 🔐 Ruta para usuario autenticado (opcional)
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// 🚗 Vehículos
Route::apiResource('vehiculos', VehiculoController::class);

// 👤 Clientes
Route::apiResource('clientes', ClienteController::class);

// 📅 Reservas
Route::apiResource('reservas', ReservaController::class);

// 📌 Ruta de prueba rápida (opcional, útil para verificar conexión)
Route::get('/ping', function () {
    return response()->json(['message' => 'API operativa']);
});
