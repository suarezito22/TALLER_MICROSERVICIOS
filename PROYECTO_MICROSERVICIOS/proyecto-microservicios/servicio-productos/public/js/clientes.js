class ClienteService {
  constructor(apiUrl) {
    this.apiUrl = apiUrl;
  }

  async listarClientes() {
    try {
      const res = await fetch(this.apiUrl);
      const data = await res.json();
      return data;
    } catch (error) {
      console.error('Error al obtener clientes:', error);
      return [];
    }
  }

  async registrarCliente(cliente) {
    try {
      const res = await fetch(this.apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cliente)
      });
      return await res.json();
    } catch (error) {
      console.error('Error al registrar cliente:', error);
      throw error;
    }
  }
}

function validarCliente(cliente) {
  const errores = [];

  if (!cliente.nombre || cliente.nombre.trim() === '') {
    errores.push('El nombre es obligatorio.');
  }

  if (!cliente.contacto || cliente.contacto.trim() === '') {
    errores.push('El número de contacto es obligatorio.');
  }

  if (!cliente.licencia || cliente.licencia.trim() === '') {
    errores.push('La licencia es obligatoria.');
  }

  if (!cliente.documento || cliente.documento.trim() === '') {
    errores.push('El documento es obligatorio.');
  }

  return errores;
}

// Instancia del servicio
const servicio = new ClienteService('http://127.0.0.1:8000/api/clientes');

async function cargarClientes() {
  const clientes = await servicio.listarClientes();
  const tabla = document.getElementById('tablaClientes');
  tabla.innerHTML = '';

  clientes.forEach(c => {
    const fila = document.createElement('tr');
    fila.innerHTML = `
      <td>${c.id}</td>
      <td>${c.nombre}</td>
      <td>${c.contacto}</td>
      <td>${c.licencia}</td>
      <td>${c.documento}</td>
      <td>${c.email ?? ''}</td>
    `;
    tabla.appendChild(fila);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('formCliente').addEventListener('submit', async function (e) {
    e.preventDefault();
    const datos = new FormData(this);
    const cliente = Object.fromEntries(datos.entries());

    const errores = validarCliente(cliente);
    if (errores.length > 0) {
      alert(errores.join('\n'));
      return;
    }

    try {
      await servicio.registrarCliente(cliente);
      alert('Cliente registrado correctamente');
      this.reset();
      cargarClientes();
    } catch (error) {
      alert('Error al registrar cliente');
    }
  });

  cargarClientes();
});
