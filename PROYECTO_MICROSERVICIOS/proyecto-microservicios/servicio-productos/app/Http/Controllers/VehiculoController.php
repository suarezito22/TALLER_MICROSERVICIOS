<?php

namespace App\Http\Controllers;

use App\Models\Vehiculo;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class VehiculoController extends Controller
{
    public function index()
    {
        return response()->json(Vehiculo::all(), Response::HTTP_OK);
    }

    public function store(Request $request)
{
    $request->validate([
        'marca' => 'required|string|max:255',
        'modelo' => 'required|string|max:255',
        'anio' => 'required|integer|min:1900|max:' . (date('Y') + 1),
        'categoria' => 'required|string|max:255',
        'estado' => 'required|string|max:255' // ← NUEVA línea
    ]);

    $vehiculo = Vehiculo::create($request->all());
    return response()->json($vehiculo, Response::HTTP_CREATED);
}


    public function show($id)
    {
        $vehiculo = Vehiculo::find($id);
        if (!$vehiculo) {
            return response()->json(['error' => 'Vehículo no encontrado'], Response::HTTP_NOT_FOUND);
        }
        return response()->json($vehiculo, Response::HTTP_OK);
    }

    public function update(Request $request, $id)
    {
        $vehiculo = Vehiculo::find($id);
        if (!$vehiculo) {
            return response()->json(['error' => 'Vehículo no encontrado'], Response::HTTP_NOT_FOUND);
        }

        $request->validate([
            'marca' => 'sometimes|required|string|max:255',
            'modelo' => 'sometimes|required|string|max:255',
            'anio' => 'sometimes|required|integer|min:1900|max:' . (date('Y') + 1),
            'categoria' => 'sometimes|required|string|max:255',
        ]);

        $vehiculo->update($request->all());
        return response()->json($vehiculo, Response::HTTP_OK);
    }

    public function destroy($id)
    {
        $vehiculo = Vehiculo::find($id);
        if (!$vehiculo) {
            return response()->json(['error' => 'Vehículo no encontrado'], Response::HTTP_NOT_FOUND);
        }

        $vehiculo->delete();
        return response()->json(['mensaje' => 'Vehículo eliminado'], Response::HTTP_OK);
    }
}
