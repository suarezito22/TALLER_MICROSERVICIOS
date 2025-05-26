const API_URL = 'http://127.0.0.1:8000/api/vehiculos';

async function obtenerDisponibles() {
  try {
    const res = await fetch(API_URL);
    const vehiculos = await res.json();
    return vehiculos.filter(v => v.estado === 'disponible');
  } catch (error) {
    console.error('Error al obtener vehículos:', error);
    return [];
  }
}

function mostrarDisponibles(vehiculos) {
  const tabla = document.getElementById('tablaDisponibles');
  tabla.innerHTML = '';

  vehiculos.forEach(v => {
    const fila = document.createElement('tr');
    fila.innerHTML = `
      <td>${v.id}</td>
      <td>${v.marca}</td>
      <td>${v.modelo}</td>
      <td>${v.anio}</td>
      <td>${v.categoria}</td>
      <td>${v.estado}</td>
    `;
    tabla.appendChild(fila);
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  const disponibles = await obtenerDisponibles();
  mostrarDisponibles(disponibles);
});
