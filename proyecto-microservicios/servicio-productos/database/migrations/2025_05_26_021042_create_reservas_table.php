<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
   public function up()
{
    Schema::create('reservas', function (Blueprint $table) {
        $table->id();
        $table->unsignedBigInteger('cliente_id');
        $table->unsignedBigInteger('vehiculo_id');
        $table->date('fecha_inicio');
        $table->date('fecha_fin');
        $table->enum('estado', ['pendiente', 'activa', 'completada', 'cancelada'])->default('pendiente');
        $table->timestamps();

        $table->foreign('cliente_id')->references('id')->on('clientes')->onDelete('cascade');
        $table->foreign('vehiculo_id')->references('id')->on('vehiculos')->onDelete('cascade');
    });
}


    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('reservas');
    }
};
