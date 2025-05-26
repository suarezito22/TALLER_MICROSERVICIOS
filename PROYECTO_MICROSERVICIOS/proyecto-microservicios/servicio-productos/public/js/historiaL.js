const API_URL = 'http://127.0.0.1:8000/api/reservas';

async function obtenerHistorial() {
  try {
    const res = await fetch(API_URL);
    const reservas = await res.json();
    return reservas.filter(r => r.estado === 'completada');
  } catch (error) {
    console.error('Error al obtener historial:', error);
    return [];
  }
}

function mostrarHistorial(reservas) {
  const tabla = document.getElementById('tablaHistorial');
  tabla.innerHTML = '';

  reservas.forEach(r => {
    const cliente = r.cliente ? `${r.cliente.nombre} (${r.cliente.documento})` : r.cliente_id;
    const vehiculo = r.vehiculo ? `${r.vehiculo.marca} ${r.vehiculo.modelo} (${r.vehiculo.anio})` : r.vehiculo_id;

    const fila = document.createElement('tr');
    fila.innerHTML = `
      <td>${r.id}</td>
      <td>${cliente}</td>
      <td>${vehiculo}</td>
      <td>${r.fecha_inicio}</td>
      <td>${r.fecha_fin}</td>
      <td>${r.estado}</td>
    `;
    tabla.appendChild(fila);
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  const historial = await obtenerHistorial();
  mostrarHistorial(historial);
});
