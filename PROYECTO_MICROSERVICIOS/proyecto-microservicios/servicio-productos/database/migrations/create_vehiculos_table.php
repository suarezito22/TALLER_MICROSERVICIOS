<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('vehiculos', function (Blueprint $table) {
            $table->id();

            // Datos del vehículo
            $table->string('marca');
            $table->string('modelo');
            $table->year('anio');
            $table->string('categoria');

            // Estado controlado por enumeración
            $table->enum('estado', ['Disponible', 'Alquilado', 'Mantenimiento'])->default('Disponible');

            // Timestamps Laravel (created_at, updated_at)
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('vehiculos');
    }
};
