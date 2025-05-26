<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Vehiculo extends Model
{
    use HasFactory;

    // ✅ Incluimos el campo 'estado' aquí
    protected $fillable = ['marca', 'modelo', 'anio', 'categoria', 'estado'];
}
