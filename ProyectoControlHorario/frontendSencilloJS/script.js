// URL base de tu API (ajusta el puerto si es necesario)
const API_BASE_URL = 'http://localhost:8080';

// Variable global para almacenar el token JWT
let authToken = localStorage.getItem('authToken'); // ← Cargar desde localStorage al inicio

// Al cargar la página, verificar si hay token guardado
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Frontend de Control Horario cargado');
    console.log('📡 API Base URL:', API_BASE_URL);
    
    // Si hay token guardado, mostrar que está autenticado
    if (authToken) {
        mostrarToken(authToken);
        habilitarSeccionesProtegidas();
        mostrarRespuesta('loginResponse', '✅ Sesión activa (token recuperado)', 'success');
    }
});

// ============================================
// FUNCIÓN: REGISTRAR USUARIO
// ============================================
async function registrarUsuario() {
    const username = document.getElementById('regUsername').value;
    const password = document.getElementById('regPassword').value;
    const departamento = document.getElementById('regDepartamento').value;
    const rol = document.getElementById('regRol').value;

    if (!username || !password || !departamento) {
        mostrarRespuesta('regResponse', '⚠️ Por favor completa todos los campos', 'error');
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/general/registro`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username,
                password,
                departamento,
                rol
            })
        });

        const data = await response.text();
        
        if (response.ok) {
            mostrarRespuesta('regResponse', data, 'success');
            // Limpiar campos
            document.getElementById('regUsername').value = '';
            document.getElementById('regPassword').value = '';
            document.getElementById('regDepartamento').value = '';
        } else {
            mostrarRespuesta('regResponse', data, 'error');
        }
    } catch (error) {
        mostrarRespuesta('regResponse', '❌ Error de conexión: ' + error.message, 'error');
    }
}

// ============================================
// FUNCIÓN: LOGIN USUARIO
// ============================================
async function loginUsuario() {
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    if (!username || !password) {
        mostrarRespuesta('loginResponse', '⚠️ Por favor ingresa usuario y contraseña', 'error');
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/general/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username,
                password
            })
        });

        const data = await response.text();
        
        if (response.ok) {
            authToken = data; // Guardar en variable
            localStorage.setItem('authToken', data); // ← Guardar en localStorage
            mostrarRespuesta('loginResponse', '✅ Login exitoso', 'success');
            mostrarToken(data);
            habilitarSeccionesProtegidas();
        } else {
            mostrarRespuesta('loginResponse', data, 'error');
        }
    } catch (error) {
        mostrarRespuesta('loginResponse', '❌ Error de conexión: ' + error.message, 'error');
    }
}

// ============================================
// FUNCIÓN: FICHAR
// ============================================
async function fichar() {
    if (!authToken) {
        mostrarRespuesta('ficharResponse', '⚠️ Debes hacer login primero', 'error');
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/fichar`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        const data = await response.text();
        
        if (response.ok) {
            mostrarRespuesta('ficharResponse', data, 'success');
        } else {
            mostrarRespuesta('ficharResponse', data, 'error');
            // Si el token expiró, limpiar sesión
            if (data.includes('Token inválido o expirado')) {
                cerrarSesion();
            }
        }
    } catch (error) {
        mostrarRespuesta('ficharResponse', '❌ Error de conexión: ' + error.message, 'error');
    }
}

// ============================================
// FUNCIÓN: LISTAR FICHAJES
// ============================================
async function listarFichajes() {
    if (!authToken) {
        mostrarRespuesta('listarResponse', '⚠️ Debes hacer login primero', 'error');
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/listarFichajes`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        if (response.ok) {
            const fichajes = await response.json();
            mostrarRespuesta('listarResponse', `✅ Se encontraron ${fichajes.length} fichajes`, 'success');
            mostrarTablaFichajes(fichajes);
        } else {
            const data = await response.text();
            mostrarRespuesta('listarResponse', data, 'error');
            // Si el token expiró, limpiar sesión
            if (data.includes('Token inválido o expirado')) {
                cerrarSesion();
            }
        }
    } catch (error) {
        mostrarRespuesta('listarResponse', '❌ Error de conexión: ' + error.message, 'error');
    }
}

// ============================================
// FUNCIÓN: SOLICITAR EDICIÓN
// ============================================
async function solicitarEdicion() {
    if (!authToken) {
        mostrarRespuesta('edicionResponse', '⚠️ Debes hacer login primero', 'error');
        return;
    }

    const fecha = document.getElementById('edicionFecha').value;
    const hora = document.getElementById('edicionHora').value;
    const nuevaFecha = document.getElementById('edicionNuevaFecha').value;
    const nuevaHora = document.getElementById('edicionNuevaHora').value;
    const tipo = document.getElementById('edicionTipo').value;
    const usoHorario = document.getElementById('edicionUsoHorario').value;

    if (!fecha || !hora || !nuevaFecha || !nuevaHora || !tipo || !usoHorario) {
        mostrarRespuesta('edicionResponse', '⚠️ Por favor completa todos los campos', 'error');
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/solicitarEdicion`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                fecha,
                hora,
                nuevaFecha,
                nuevaHora,
                tipo,
                usoHorario
            })
        });

        const data = await response.text();
        
        if (response.ok) {
            mostrarRespuesta('edicionResponse', data, 'success');
            // Limpiar campos
            document.getElementById('edicionFecha').value = '';
            document.getElementById('edicionHora').value = '';
            document.getElementById('edicionNuevaFecha').value = '';
            document.getElementById('edicionNuevaHora').value = '';
            document.getElementById('edicionTipo').value = '';
            document.getElementById('edicionUsoHorario').value = '';
        } else {
            mostrarRespuesta('edicionResponse', data, 'error');
            // Si el token expiró, limpiar sesión
            if (data.includes('Token inválido o expirado')) {
                cerrarSesion();
            }
        }
    } catch (error) {
        mostrarRespuesta('edicionResponse', '❌ Error de conexión: ' + error.message, 'error');
    }
}

// ============================================
// FUNCIÓN: CERRAR SESIÓN
// ============================================
function cerrarSesion() {
    authToken = null;
    localStorage.removeItem('authToken'); // ← Eliminar de localStorage
    document.getElementById('tokenDisplay').classList.remove('show');
    document.getElementById('tokenDisplay').innerHTML = '';
    document.getElementById('loginUsername').value = '';
    document.getElementById('loginPassword').value = '';
    mostrarRespuesta('loginResponse', '✅ Sesión cerrada', 'success');
    
    // Limpiar respuestas de secciones protegidas
    document.getElementById('ficharResponse').style.display = 'none';
    document.getElementById('listarResponse').style.display = 'none';
    document.getElementById('edicionResponse').style.display = 'none';
    document.getElementById('fichajesTable').innerHTML = '';
}

// ============================================
// FUNCIONES AUXILIARES
// ============================================

function mostrarRespuesta(elementId, mensaje, tipo) {
    const element = document.getElementById(elementId);
    element.textContent = mensaje;
    element.className = `response ${tipo}`;
}

function mostrarToken(token) {
    const tokenDisplay = document.getElementById('tokenDisplay');
    tokenDisplay.innerHTML = `<strong>🔑 Token JWT (guardado en localStorage):</strong><br>${token}`;
    tokenDisplay.classList.add('show');
}

function habilitarSeccionesProtegidas() {
    const protectedSections = document.querySelectorAll('.section.protected');
    protectedSections.forEach(section => {
        section.style.opacity = '1';
    });
}

function mostrarTablaFichajes(fichajes) {
    const tableContainer = document.getElementById('fichajesTable');
    
    if (fichajes.length === 0) {
        tableContainer.innerHTML = '<p style="text-align: center; color: #666;">No hay fichajes registrados</p>';
        return;
    }

    let tableHTML = `
        <table>
            <thead>
                <tr>
                    <th>Fecha y Hora</th>
                    <th>Tipo</th>
                    <th>Huella (Hash)</th>
                </tr>
            </thead>
            <tbody>
    `;

    fichajes.forEach(fichaje => {
        tableHTML += `
            <tr>
                <td>${fichaje.instante}</td>
                <td>${fichaje.tipo}</td>
                <td style="font-size: 0.8em; word-break: break-all;">${fichaje.huella}</td>
            </tr>
        `;
    });

    tableHTML += `
            </tbody>
        </table>
    `;

    tableContainer.innerHTML = tableHTML;
}