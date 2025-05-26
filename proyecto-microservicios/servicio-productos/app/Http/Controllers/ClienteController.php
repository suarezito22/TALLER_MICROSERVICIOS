<?php

namespace App\Http\Controllers;

use App\Models\Cliente;
use Illuminate\Http\Request;

class ClienteController extends Controller
{
    // Listar todos los clientes
    public function index()
    {
        return Cliente::all();
    }

    // Registrar nuevo cliente
    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string',
            'contacto' => 'required|string',
            'licencia' => 'required|string',
            'documento' => 'required|string',
            'email' => 'nullable|email'
        ]);

        return Cliente::create($request->all());
    }

    // Mostrar un cliente por ID
    public function show($id)
    {
        return Cliente::findOrFail($id);
    }

    // Actualizar cliente
    public function update(Request $request, $id)
    {
        $cliente = Cliente::findOrFail($id);
        $cliente->update($request->all());
        return $cliente;
    }

    // Eliminar cliente
    public function destroy($id)
    {
        Cliente::findOrFail($id)->delete();
        return response()->json(['mensaje' => 'Cliente eliminado']);
    }
}
