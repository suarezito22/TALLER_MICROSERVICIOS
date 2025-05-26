class ReservaService {
  constructor(apiUrl) {
    this.apiUrl = apiUrl;
  }

  async listar() {
    try {
      const res = await fetch(this.apiUrl);
      return await res.json();
    } catch (error) {
      console.error('Error al obtener reservas:', error);
      return [];
    }
  }

  async registrar(reserva) {
    try {
      const res = await fetch(this.apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reserva)
      });

      if (!res.ok) throw await res.json();
      return await res.json();
    } catch (error) {
      console.error('Error al registrar reserva:', error);
      throw error;
    }
  }

  async actualizarEstado(id, nuevoEstado) {
    try {
      await fetch(`${this.apiUrl}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: nuevoEstado })
      });
    } catch (err) {
      console.error(`Error al actualizar estado de reserva ${id}:`, err);
    }
  }
}

async function cargarClientes() {
  const res = await fetch('http://127.0.0.1:8000/api/clientes');
  const clientes = await res.json();
  const select = document.getElementById('cliente_id');
  select.innerHTML = '';
  clientes.forEach(c => {
    const option = document.createElement('option');
    option.value = c.id;
    option.textContent = `${c.nombre} (${c.documento})`;
    select.appendChild(option);
  });
}

async function cargarVehiculos() {
  const res = await fetch('http://127.0.0.1:8000/api/vehiculos');
  const vehiculos = await res.json();
  const select = document.getElementById('vehiculo_id');
  select.innerHTML = '';
  vehiculos
    .filter(v => v.estado === 'disponible')
    .forEach(v => {
      const option = document.createElement('option');
      option.value = v.id;
      option.textContent = `${v.marca} ${v.modelo} (${v.anio})`;
      select.appendChild(option);
    });
}

function calcularNuevoEstado(fechaInicio, fechaFin, estadoActual) {
  const hoy = new Date().toISOString().split('T')[0];
  if (estadoActual === 'cancelada' || estadoActual === 'completada') return estadoActual;
  if (hoy < fechaInicio) return 'pendiente';
  if (hoy >= fechaInicio && hoy <= fechaFin) return 'activa';
  if (hoy > fechaFin) return 'completada';
  return estadoActual;
}

async function mostrarReservas(reservas) {
  const tabla = document.getElementById('tablaReservas');
  tabla.innerHTML = '';

  for (const r of reservas) {
    const estadoCalculado = calcularNuevoEstado(r.fecha_inicio, r.fecha_fin, r.estado);
    if (estadoCalculado !== r.estado) {
      await servicio.actualizarEstado(r.id, estadoCalculado);
      r.estado = estadoCalculado;
    }

    const nombreCliente = r.cliente ? `${r.cliente.nombre} (${r.cliente.documento})` : r.cliente_id;
    const nombreVehiculo = r.vehiculo ? `${r.vehiculo.marca} ${r.vehiculo.modelo} (${r.vehiculo.anio})` : r.vehiculo_id;

    const fila = document.createElement('tr');
    fila.innerHTML = `
      <td>${r.id}</td>
      <td>${nombreCliente}</td>
      <td>${nombreVehiculo}</td>
      <td>${r.fecha_inicio}</td>
      <td>${r.fecha_fin}</td>
      <td>${r.estado}</td>
    `;
    tabla.appendChild(fila);
  }
}

// Inicializar
const servicio = new ReservaService('http://127.0.0.1:8000/api/reservas');

document.addEventListener('DOMContentLoaded', () => {
  cargarClientes();
  cargarVehiculos();
  servicio.listar().then(mostrarReservas);

  document.getElementById('formReserva').addEventListener('submit', async function (e) {
    e.preventDefault();
    const datos = new FormData(this);
    const reserva = Object.fromEntries(datos.entries());

    if (new Date(reserva.fecha_fin) < new Date(reserva.fecha_inicio)) {
      alert('La fecha de fin no puede ser anterior a la de inicio.');
      return;
    }

    try {
      await servicio.registrar(reserva);
      alert('Reserva registrada correctamente');
      this.reset();
      await cargarVehiculos();
      const reservas = await servicio.listar();
      mostrarReservas(reservas);
    } catch (err) {
      alert('Error al registrar la reserva');
    }
  });
});
