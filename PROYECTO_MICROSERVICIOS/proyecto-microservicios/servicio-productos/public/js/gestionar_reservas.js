const API_URL = 'http://127.0.0.1:8000/api/reservas';

async function obtenerReservas() {
  const res = await fetch(API_URL);
  return await res.json();
}

async function eliminarReserva(id) {
  if (!confirm('¿Estás seguro de eliminar esta reserva?')) return;
  await fetch(`${API_URL}/${id}`, {
    method: 'DELETE'
  });
  cargarReservas();

  if (typeof cargarVehiculos === 'function') {
    await cargarVehiculos();
  }
}

async function cambiarEstado(id, nuevoEstado) {
  await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ estado: nuevoEstado })
  });
  await cargarReservas();

  // Si estás en otra vista que necesita actualizar lista de vehículos
  if (typeof cargarVehiculos === 'function') {
    await cargarVehiculos();
  }
}

function calcularEstado(fechaInicio, fechaFin, estadoActual) {
  const hoy = new Date().toISOString().split('T')[0];
  if (estadoActual === 'cancelada' || estadoActual === 'completada') return estadoActual;
  if (hoy < fechaInicio) return 'pendiente';
  if (hoy >= fechaInicio && hoy <= fechaFin) return 'activa';
  if (hoy > fechaFin) return 'completada';
  return estadoActual;
}

function mostrarReservas(reservas) {
  const tabla = document.getElementById('tablaReservas');
  tabla.innerHTML = '';

  reservas.forEach(r => {
    const cliente = r.cliente ? `${r.cliente.nombre}` : r.cliente_id;
    const vehiculo = r.vehiculo ? `${r.vehiculo.marca} ${r.vehiculo.modelo}` : r.vehiculo_id;
    const estadoCalculado = calcularEstado(r.fecha_inicio, r.fecha_fin, r.estado);

    const fila = document.createElement('tr');
    fila.innerHTML = `
      <td>${r.id}</td>
      <td>${cliente}</td>
      <td>${vehiculo}</td>
      <td>${r.fecha_inicio}</td>
      <td>${r.fecha_fin}</td>
      <td>${estadoCalculado}</td>
      <td>
        <button onclick="cambiarEstado(${r.id}, 'completada')">Completar</button>
        <button onclick="cambiarEstado(${r.id}, 'cancelada')">Cancelar</button>
        <button onclick="eliminarReserva(${r.id})">Eliminar</button>
      </td>
    `;
    tabla.appendChild(fila);
  });
}

async function cargarReservas() {
  const reservas = await obtenerReservas();
  mostrarReservas(reservas);
}

document.addEventListener('DOMContentLoaded', cargarReservas);
