<?php

namespace App\Http\Controllers;

use App\Models\Reserva;
use App\Models\Vehiculo;
use Illuminate\Http\Request;

class ReservaController extends Controller
{
    // Listar todas las reservas con relaciones
    public function index()
    {
        return Reserva::with(['cliente', 'vehiculo'])->get();
    }

    // Registrar nueva reserva
    public function store(Request $request)
    {
        $request->validate([
            'cliente_id'   => 'required|exists:clientes,id',
            'vehiculo_id'  => 'required|exists:vehiculos,id',
            'fecha_inicio' => 'required|date',
            'fecha_fin'    => 'required|date|after_or_equal:fecha_inicio',
            'estado'       => 'in:pendiente,activa,completada,cancelada'
        ]);

        $reserva = Reserva::create($request->all());

        // Cambiar estado del vehículo a 'alquilado'
        $vehiculo = Vehiculo::find($request->vehiculo_id);
        if ($vehiculo) {
            $vehiculo->estado = 'alquilado';
            $vehiculo->save();
        }

        return $reserva->load(['cliente', 'vehiculo']);
    }

    // Mostrar una reserva específica con relaciones
    public function show($id)
    {
        return Reserva::with(['cliente', 'vehiculo'])->findOrFail($id);
    }

    // Actualizar una reserva
    public function update(Request $request, $id)
    {
        $reserva = Reserva::findOrFail($id);

        $request->validate([
            'fecha_inicio' => 'sometimes|date',
            'fecha_fin'    => 'sometimes|date|after_or_equal:fecha_inicio',
            'estado'       => 'sometimes|in:pendiente,activa,completada,cancelada'
        ]);

        $reserva->update($request->all());

        // Si la reserva se completó o canceló, liberar el vehículo
        if (in_array($reserva->estado, ['completada', 'cancelada'])) {
            $vehiculo = Vehiculo::find($reserva->vehiculo_id);
            if ($vehiculo) {
                $vehiculo->estado = 'disponible';
                $vehiculo->save();
            }
        }

        return $reserva->load(['cliente', 'vehiculo']);
    }

    // Eliminar reserva
    public function destroy($id)
    {
        $reserva = Reserva::findOrFail($id);
        $reserva->delete();

        return response()->json(['mensaje' => 'Reserva eliminada'], 200);
    }
}
