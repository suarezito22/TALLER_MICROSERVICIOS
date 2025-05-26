const API_URL = 'http://127.0.0.1:8000/api/reservas';

async function generarReporte() {
  try {
    const res = await fetch(API_URL);
    const reservas = await res.json();

    const estadoSeleccionado = document.getElementById('estado').value;
    const cuerpoTabla = document.getElementById('tablaReportes');
    cuerpoTabla.innerHTML = '';

    // Filtrar si es necesario
    const filtradas = reservas.filter(r => {
      return estadoSeleccionado === 'todos' || r.estado === estadoSeleccionado;
    });

    // Mostrar reservas
    filtradas.forEach(r => {
      const fila = document.createElement('tr');

      const clienteNombre = r.cliente?.nombre ?? `ID: ${r.cliente_id}`;
      const vehiculoNombre = r.vehiculo ? `${r.vehiculo.marca} ${r.vehiculo.modelo} (${r.vehiculo.anio})` : `ID: ${r.vehiculo_id}`;

      fila.innerHTML = `
        <td>${r.id}</td>
        <td>${clienteNombre}</td>
        <td>${vehiculoNombre}</td>
        <td>${r.fecha_inicio}</td>
        <td>${r.fecha_fin}</td>
        <td>${r.estado}</td>
      `;
      cuerpoTabla.appendChild(fila);
    });

    if (filtradas.length === 0) {
      const fila = document.createElement('tr');
      fila.innerHTML = `<td colspan="6" style="text-align:center;">No hay resultados</td>`;
      cuerpoTabla.appendChild(fila);
    }

  } catch (error) {
    console.error('Error al generar el reporte:', error);
    alert('Ocurrió un error al generar el reporte.');
  }
}
