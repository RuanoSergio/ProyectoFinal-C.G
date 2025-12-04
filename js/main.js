const formCita = document.getElementById('formCita');

if (formCita) {
    formCita.addEventListener('submit', e => {
        e.preventDefault();

        const nombre = document.getElementById('nombre').value.trim();
        const correo = document.getElementById('correo').value.trim(); 
        const celular = document.getElementById('celular').value.trim(); 
        const servicio = document.getElementById('servicio').value;
        const fecha = document.getElementById('fecha').value;
        const hora = document.getElementById('hora').value;

        if (!nombre || !correo || !celular || !servicio || !fecha || !hora) {
            alert('Por favor completa todos los campos');
            return;
        }
        
        const hoy = new Date();
        const fechaSeleccionada = new Date(fecha);
        if (fechaSeleccionada < hoy.setHours(0, 0, 0, 0)) {
            alert('La fecha no puede ser anterior a hoy.');
            return;
        }

        const data = new FormData();
        data.append('nombre', nombre);
        data.append('correo', correo); 
        data.append('celular', celular); 
        data.append('servicio', servicio);
        data.append('fecha', fecha);
        data.append('hora', hora);

        fetch('guardar_cita.php', {
            method: 'POST',
            body: data
        })
        .then(response => response.json())
        .then(result => {
            alert(result.message);
            if (result.success) {
                formCita.reset();
            }
        })
        .catch(error => {
            console.error('Error en fetch al guardar:', error);
            alert('Ocurrió un error de red o de servidor al agendar la cita.');
        });
    });
}

function mostrarCitas(nombreBuscado, celularBuscado) {
    const tablaCitasBody = document.querySelector('#tablaCitas tbody');
    const container = document.getElementById('listaCitasContainer');
    if (!tablaCitasBody || !container) return; 

    container.style.display = 'block';
    tablaCitasBody.innerHTML = '<tr><td colspan="7">Buscando citas...</td></tr>'; 

    const params = new URLSearchParams();
    params.append('nombre', nombreBuscado);
    params.append('celular', celularBuscado); 

    fetch('obtener_citas.php?' + params.toString())
    .then(response => response.json())
    .then(citas => {
        if (!Array.isArray(citas) || citas.length === 0 || citas.success === false) {
            tablaCitasBody.innerHTML = '<tr><td colspan="7">No se encontraron citas con esos datos.</td></tr>';
            return;
        }

        tablaCitasBody.innerHTML = '';
        citas.forEach(cita => {
            const row = tablaCitasBody.insertRow();
            row.innerHTML = `
                <td>${cita.nombre}</td>
                <td>${cita.correo}</td> 
                <td>${cita.celular}</td> 
                <td>${cita.servicio}</td>
                <td>${cita.fecha}</td>
                <td>${cita.hora}</td>
                <td><button onclick="eliminarCita(${cita.id})" class="btn-cancelar">Cancelar</button></td>
            `;
        });
        
    })
    .catch(error => {
        console.error('Error al cargar las citas:', error);
        tablaCitasBody.innerHTML = '<tr><td colspan="7">Error al cargar las citas.</td></tr>';
    });
}

function eliminarCita(id) {
    if (!confirm('¿Estás seguro de que quieres cancelar esta cita?')) {
        return;
    }

    const data = new FormData();
    data.append('id', id);

    fetch('eliminar_cita.php', {
        method: 'POST',
        body: data
    })
    .then(response => response.json())
    .then(result => {
        if (result.success) {
            alert(result.message || 'Cita eliminada con éxito.');
            
            const nombreBusqueda = document.getElementById('nombreBusqueda').value.trim();
            const celularBusqueda = document.getElementById('celularBusqueda').value;
            mostrarCitas(nombreBusqueda, celularBusqueda);
            
        } else {
            alert('Error al eliminar la cita: ' + (result.message || 'Desconocido'));
        }
    })
    .catch(error => {
        console.error('Error en fetch al eliminar:', error);
        alert('Ocurrió un error de red al eliminar la cita.');
    });
}

document.addEventListener("DOMContentLoaded", () => {
    
    const params = new URLSearchParams(window.location.search);
    let promo = params.get("promo");
    let servicioSel = params.get("servicio");

    const select = document.getElementById("servicio");

    const normalizar = t => t.toLowerCase().replace(/[^a-z0-9]/g, "");

    if (select) {
        if (promo) {
            const promoNorm = normalizar(promo);
            for (let option of select.options) {
                const optionNorm = normalizar(option.value);
                if (optionNorm.includes(promoNorm)) { 
                    option.selected = true;
                    break;
                }
            }
        } 
        else if (servicioSel) {
            const servNorm = normalizar(servicioSel);
            for (let option of select.options) {
                const optionNorm = normalizar(option.value);
                if (optionNorm.includes(servNorm)) {
                    option.selected = true;
                    break;
                }
            }
        }
    }

    const formBusquedaCita = document.getElementById('formBusquedaCita');
    if (window.location.pathname.endsWith('cancelar_cita.html') && formBusquedaCita) {
        
        formBusquedaCita.addEventListener('submit', e => {
            e.preventDefault();
            
            const nombreBusqueda = document.getElementById('nombreBusqueda').value.trim();
            const celularBusqueda = document.getElementById('celularBusqueda').value.trim();

            if (!nombreBusqueda || !celularBusqueda) {
                alert('Por favor, ingresa tu nombre y celular para buscar.');
                return;
            }

            mostrarCitas(nombreBusqueda, celularBusqueda);
        });
    }
});