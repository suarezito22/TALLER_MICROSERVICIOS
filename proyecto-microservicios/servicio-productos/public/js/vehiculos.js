class VehiculoService {
  constructor(apiUrl) {
    this.apiUrl = apiUrl;
  }

  async listarVehiculos() {
    try {
      const res = await fetch(this.apiUrl);
      const data = await res.json();
      return data;
    } catch (error) {
      console.error('Error al obtener vehículos:', error);
      return [];
    }
  }

  async registrarVehiculo(vehiculo) {
    try {
      const res = await fetch(this.apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vehiculo)
      });
      return await res.json();
    } catch (error) {
      console.error('Error al registrar vehículo:', error);
      throw error;
    }
  }
}

// Validación personalizada
function validarVehiculo(vehiculo) {
  const errores = [];

  if (!vehiculo.marca || vehiculo.marca.trim() === '') {
    errores.push('La marca es obligatoria.');
  }

  if (!vehiculo.modelo || vehiculo.modelo.trim() === '') {
    errores.push('El modelo es obligatorio.');
  }

  if (!vehiculo.anio || isNaN(vehiculo.anio) || vehiculo.anio < 1900 || vehiculo.anio > new Date().getFullYear() + 1) {
    errores.push('El año debe ser un número válido.');
  }

  if (!vehiculo.categoria || vehiculo.categoria.trim() === '') {
    errores.push('La categoría es obligatoria.');
  }

  if (!['disponible', 'alquilado', 'mantenimiento'].includes(vehiculo.estado)) {
    errores.push('El estado no es válido.');
  }

  return errores;
}

// Instancia del servicio
const servicio = new VehiculoService('http://127.0.0.1:8000/api/vehiculos');

// Cargar datos en tabla
async function cargarVehiculos() {
  const vehiculos = await servicio.listarVehiculos();
  const tabla = document.getElementById('tablaVehiculos');
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

// Manejar el envío del formulario
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('formVehiculo').addEventListener('submit', async function (e) {
    e.preventDefault();
    const datos = new FormData(this);
    const vehiculo = Object.fromEntries(datos.entries());

    const errores = validarVehiculo(vehiculo);
    if (errores.length > 0) {
      alert(errores.join('\n'));
      return;
    }

    try {
      await servicio.registrarVehiculo(vehiculo);
      alert('Vehículo registrado correctamente.');
      this.reset();
      cargarVehiculos();
    } catch (error) {
      alert('Ocurrió un error al registrar el vehículo.');
    }
  });

  // Cargar vehículos al inicio
  cargarVehiculos();
});
