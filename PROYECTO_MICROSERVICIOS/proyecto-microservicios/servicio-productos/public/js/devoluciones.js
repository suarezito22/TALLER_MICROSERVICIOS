const API_URL = 'http://127.0.0.1:8000/api/reservas';

async function obtenerReservasActivas() {
  const res = await fetch(API_URL);
  const reservas = await res.json();
  return reservas.filter(r => r.estado === 'activa');
}

async function marcarDevolucion(id) {
  await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ estado: 'completada' })
  });
  cargarDevoluciones();
}

function mostrarDevoluciones(reservas) {
  const tabla = document.getElementById('tablaDevoluciones');
  tabla.innerHTML = '';

  reservas.forEach(r => {
    const cliente = r.cliente ? `${r.cliente.nombre}` : r.cliente_id;
    const vehiculo = r.vehiculo ? `${r.vehiculo.marca} ${r.vehiculo.modelo}` : r.vehiculo_id;

    const fila = document.createElement('tr');
    fila.innerHTML = `
      <td>${r.id}</td>
      <td>${cliente}</td>
      <td>${vehiculo}</td>
      <td>${r.fecha_inicio}</td>
      <td>${r.fecha_fin}</td>
      <td>${r.estado}</td>
      <td><button onclick="marcarDevolucion(${r.id})">Marcar como Devuelto</button></td>
    `;
    tabla.appendChild(fila);
  });
}

async function cargarDevoluciones() {
  const reservas = await obtenerReservasActivas();
  mostrarDevoluciones(reservas);
}

document.addEventListener('DOMContentLoaded', cargarDevoluciones);
