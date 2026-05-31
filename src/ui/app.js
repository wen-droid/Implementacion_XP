import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// ══════════════════════════════════════
// CONEXIÓN SUPABASE
// ══════════════════════════════════════
const supabase = createClient(
  'https://iqzsahvgafyrjgzgtzgk.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlxenNhaHZnYWZ5cmpnemd0emdrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAxODcwMzIsImV4cCI6MjA5NTc2MzAzMn0.hdCLQK5Yc6lYtaU4WEcjeQBvMdp4eCurGoTLP2KSifI'
);

// ══════════════════════════════════════
// ESTADO EN MEMORIA
// ══════════════════════════════════════
let tareas            = [];
let pruebas           = [];
let funciones         = [];
let tareaSeleccionada = null;

// Datos pendientes para reemplazo de función
let _pendienteReemplazo = null;

// ══════════════════════════════════════
// TOAST
// ══════════════════════════════════════
function toast(msg, tipo = '') {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.className   = `toast show ${tipo}`;
  setTimeout(() => { el.className = 'toast'; }, 2800);
}

// ══════════════════════════════════════
// HELPERS
// ══════════════════════════════════════
function clasificarPrueba(resultado) {
  if (!resultado) return 'PENDIENTE';
  return resultado === 'passed' ? 'APROBADA' : 'FALLIDA';
}

function badgePrueba(estado) {
  if (estado === 'APROBADA') return '<span class="badge badge-ok">Aprobada</span>';
  if (estado === 'FALLIDA')  return '<span class="badge badge-fail">Fallida</span>';
  return '<span class="badge badge-pend">Pendiente</span>';
}

function limitesPorExtension(ext) {
  return { '.js': 25, '.java': 30, '.py': 20 }[ext] || 40;
}

function contarLineasLogicas(texto) {
  return texto.split('\n').filter(l => {
    const t = l.trim();
    return t !== ''
      && !t.startsWith('//')
      && !t.startsWith('/*')
      && !t.startsWith('*')
      && !t.startsWith('*/');
  }).length;
}

// Total de líneas (incluyendo comentarios y vacías)
function contarLineasTotal(texto) {
  if (!texto.trim()) return 0;
  return texto.split('\n').length;
}

// ══════════════════════════════════════
// CONTADOR EN TIEMPO REAL — solo total
// ══════════════════════════════════════
function actualizarContadorLineas() {
  const codigo = document.getElementById('inputLineas').value;
  const total  = contarLineasTotal(codigo);
  const el     = document.getElementById('contadorLineas');
  el.textContent = `${total} línea${total !== 1 ? 's' : ''}`;
  el.className   = total > 0 ? 'lineas-info warn' : 'lineas-info';
}

// ══════════════════════════════════════
// CARGA INICIAL DESDE SUPABASE
// ══════════════════════════════════════
async function cargarDatos() {
  const [{ data: t }, { data: p }, { data: f }] = await Promise.all([
    supabase.from('tarea').select('*').order('id'),
    supabase.from('prueba').select('*').order('id'),
    supabase.from('funcion').select('*').order('id')
  ]);

  tareas    = t || [];
  pruebas   = p || [];
  funciones = f || [];

  actualizarSelectTareas();
  renderizarTareas();
  renderizarFunciones();
}

// ══════════════════════════════════════
// TAREAS
// ══════════════════════════════════════
async function agregarTarea() {
  const nombre = document.getElementById('inputTarea').value.trim();
  if (!nombre) return toast('Ingresá el nombre de la tarea', 'err');

  const { data, error } = await supabase
    .from('tarea')
    .insert([{ nombre, estadovalidacion: 'Sin validación' }])
    .select();

  if (error) return toast('Error al guardar: ' + error.message, 'err');

  tareas.push(data[0]);
  document.getElementById('inputTarea').value = '';
  actualizarSelectTareas();
  renderizarTareas();
  toast('Tarea agregada', 'ok');
}

async function agregarPrueba() {
  const tareaId   = document.getElementById('selectTarea').value;
  const nombre    = document.getElementById('inputPrueba').value.trim();
  const resultado = document.getElementById('selectResultado').value;

  if (!tareaId) return toast('Seleccioná una tarea', 'err');
  if (!nombre)  return toast('Ingresá el nombre de la prueba', 'err');

  const estado = clasificarPrueba(resultado);
  const fecha  = resultado ? new Date().toLocaleDateString() : null;

  const { data, error } = await supabase
    .from('prueba')
    .insert([{
      nombre,
      fechaejecucion:    fecha,
      resultadoobtenido: resultado || null,
      estado,
      tareaid:           parseInt(tareaId)
    }])
    .select();

  if (error) return toast('Error al guardar prueba: ' + error.message, 'err');

  pruebas.push(data[0]);
  document.getElementById('inputPrueba').value     = '';
  document.getElementById('selectResultado').value = '';

  await supabase
    .from('tarea')
    .update({ estadovalidacion: 'Con validación' })
    .eq('id', parseInt(tareaId));

  const tarea = tareas.find(t => t.id === parseInt(tareaId));
  if (tarea) tarea.estadovalidacion = 'Con validación';

  renderizarTareas();
  if (tareaSeleccionada && tareaSeleccionada.id === parseInt(tareaId)) {
    mostrarDetalleTarea(tareaSeleccionada);
  }
  toast('Prueba registrada', 'ok');
}

function actualizarSelectTareas() {
  const opciones = tareas.map(t =>
    `<option value="${t.id}">${t.nombre}</option>`
  ).join('');
  document.getElementById('selectTarea').innerHTML =
    '<option value="">— Seleccionar tarea —</option>' + opciones;
  document.getElementById('selectTareaFuncion').innerHTML =
    '<option value="">— Sin tarea —</option>' + opciones;
}

function renderizarTareas() {
  const contenedor = document.getElementById('listaTareas');
  if (tareas.length === 0) {
    contenedor.innerHTML = `
      <div class="empty">
        <div class="empty-icon">📋</div>
        No hay tareas registradas
      </div>`;
    return;
  }
  contenedor.innerHTML = tareas.map(t => {
    const sel    = tareaSeleccionada && tareaSeleccionada.id === t.id ? ' selected' : '';
    const estado = t.estadovalidacion || 'Sin validación';
    const badge  = estado === 'Sin validación'
      ? '<span class="badge badge-sin">Sin validación</span>'
      : '<span class="badge badge-con">Con validación</span>';
    return `
      <div class="list-item${sel}" onclick="window._mostrarDetalle(${t.id})">
        <span class="list-item-name">${t.nombre}</span>
        ${badge}
      </div>`;
  }).join('');
}

function mostrarDetalleTarea(ref) {
  tareaSeleccionada = tareas.find(t => t.id === ref.id);
  if (!tareaSeleccionada) return;
  renderizarTareas();

  const pruebasTarea = pruebas.filter(p => p.tareaid === tareaSeleccionada.id);
  const aprobadas    = pruebasTarea.filter(p => p.estado === 'APROBADA').length;
  const fallidas     = pruebasTarea.filter(p => p.estado === 'FALLIDA').length;
  const pendientes   = pruebasTarea.filter(p => p.estado === 'PENDIENTE').length;

  document.getElementById('detalleTituloTarea').textContent =
    'Pruebas · ' + tareaSeleccionada.nombre;
  document.getElementById('cntTotal').textContent = pruebasTarea.length;
  document.getElementById('cntOk').textContent    = aprobadas;
  document.getElementById('cntFail').textContent  = fallidas;
  document.getElementById('cntPend').textContent  = pendientes;

  document.getElementById('listaPruebas').innerHTML = pruebasTarea.length === 0
    ? '<div class="empty"><div class="empty-icon">🧪</div>Sin pruebas asociadas</div>'
    : pruebasTarea.map(p => `
        <div class="prueba-item">
          <div>
            <div class="prueba-nombre">${p.nombre}</div>
            <div class="prueba-fecha">${p.fechaejecucion || '—'}</div>
          </div>
          ${badgePrueba(p.estado)}
        </div>`).join('');

  document.getElementById('detallePruebas').style.display = 'block';
}

// ══════════════════════════════════════
// EVALUADOR SINTÁCTICO
// ══════════════════════════════════════
async function evaluarFuncion() {
  const nombre    = document.getElementById('inputFuncion').value.trim();
  const extension = document.getElementById('selectExtension').value;
  const codigo    = document.getElementById('inputLineas').value;
  const tareaId   = document.getElementById('selectTareaFuncion').value;

  if (!nombre)        return toast('Ingresá el nombre de la función', 'err');
  if (!codigo.trim()) return toast('Ingresá el código de la función', 'err');

  // ── Chequeo de duplicado ──────────────────────────────────────
  const existe = funciones.find(
    f => f.nombre.toLowerCase() === nombre.toLowerCase()
  );

  if (existe) {
    _pendienteReemplazo = { nombre, extension, codigo, tareaId };
    document.getElementById('modalMsg').textContent =
      `Ya existe una función llamada "${nombre}". ¿Querés reemplazarla con el nuevo código?`;
    document.getElementById('modalOverlay').classList.add('visible');
    return;
  }

  await _guardarFuncion(nombre, extension, codigo, tareaId);
}

async function _guardarFuncion(nombre, extension, codigo, tareaId, idReemplazar = null) {
  const lineasLogicas = contarLineasLogicas(codigo);
  const limite        = limitesPorExtension(extension);
  const superaLimite  = lineasLogicas > limite;

  if (idReemplazar) {
    // Actualizar en Supabase
    const { error } = await supabase
      .from('funcion')
      .update({
        extension,
        lineaslogicasnetas: lineasLogicas,
        superalimite:       superaLimite,
        codigo,
        tareaid: tareaId ? parseInt(tareaId) : null
      })
      .eq('id', idReemplazar);

    if (error) return toast('Error al reemplazar función: ' + error.message, 'err');

    // Actualizar en memoria
    const idx = funciones.findIndex(f => f.id === idReemplazar);
    if (idx !== -1) {
      funciones[idx] = {
        ...funciones[idx],
        extension,
        lineaslogicasnetas: lineasLogicas,
        superalimite: superaLimite,
        codigo,
        tareaid: tareaId ? parseInt(tareaId) : null
      };
    }
    toast('Función reemplazada', 'ok');
  } else {
    const { data, error } = await supabase
      .from('funcion')
      .insert([{
        nombre,
        extension,
        lineaslogicasnetas: lineasLogicas,
        superalimite:       superaLimite,
        codigo,
        tareaid: tareaId ? parseInt(tareaId) : null
      }])
      .select();

    if (error) return toast('Error al guardar función: ' + error.message, 'err');

    funciones.push(data[0]);
    toast('Función guardada', 'ok');
  }

  // Limpiar formulario
  document.getElementById('inputFuncion').value = '';
  document.getElementById('inputLineas').value  = '';
  document.getElementById('contadorLineas').textContent = '0 líneas';
  document.getElementById('contadorLineas').className  = 'lineas-info';

  renderizarFunciones();
  if (superaLimite) mostrarAviso(nombre);
}

// ── Modal: confirmar reemplazo ──────────────────────────────────
function confirmarReemplazo() {
  cerrarModal();
  if (!_pendienteReemplazo) return;
  const { nombre, extension, codigo, tareaId } = _pendienteReemplazo;
  const existente = funciones.find(f => f.nombre.toLowerCase() === nombre.toLowerCase());
  _guardarFuncion(nombre, extension, codigo, tareaId, existente?.id);
  _pendienteReemplazo = null;
}

function cancelarReemplazo() {
  cerrarModal();
  _pendienteReemplazo = null;
}

function cerrarModal() {
  document.getElementById('modalOverlay').classList.remove('visible');
}

// ── Render funciones con código (toggle) ────────────────────────
function renderizarFunciones() {
  const contenedor = document.getElementById('listaFunciones');
  if (funciones.length === 0) {
    contenedor.innerHTML = `
      <div class="empty">
        <div class="empty-icon">🔎</div>
        No hay funciones evaluadas
      </div>`;
    return;
  }
  contenedor.innerHTML = funciones.map(f => {
    const lineas = f.lineaslogicasnetas ?? f.lineasLogicas;
    const supera = f.superalimite ?? f.superaLimite;
    const lim    = limitesPorExtension(f.extension);
    const badge  = supera
      ? `<span class="badge badge-warn">⚠ ${lineas} > ${lim}</span>`
      : `<span class="badge badge-ok">✓ ${lineas} ≤ ${lim}</span>`;
    const tarea   = f.tareaid ? tareas.find(t => t.id === f.tareaid) : null;
    const tieneCode = f.codigo && f.codigo.trim().length > 0;
    const toggleBtn = tieneCode
      ? `<span class="funcion-toggle" title="Ver / ocultar código">{ }</span>`
      : '';
    const codigoHtml = tieneCode
      ? `<pre class="funcion-codigo" style="display:none">${escapeHtml(f.codigo)}</pre>`
      : '';
    return `
      <div class="funcion-item" ${tieneCode ? 'onclick="window._toggleCodigo(this)"' : ''} style="${tieneCode ? 'cursor:pointer' : ''}">
        <div class="funcion-top">
          <div>
            <div style="display:flex;align-items:center;gap:6px">
              <span class="funcion-nombre">${f.nombre}()</span>
              <span class="funcion-ext">${f.extension}</span>
              ${toggleBtn}
            </div>
            ${tarea ? `<div class="funcion-tarea">↳ ${tarea.nombre}</div>` : ''}
          </div>
          ${badge}
        </div>
        ${codigoHtml}
      </div>`;
  }).join('');
}

window._toggleCodigo = function(card) {
  const pre = card.querySelector('.funcion-codigo');
  if (!pre) return;
  const abierto = pre.style.display !== 'none';
  pre.style.display = abierto ? 'none' : 'block';
  card.classList.toggle('abierto', !abierto);
};

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// ══════════════════════════════════════
// AVISO FLOTANTE
// ══════════════════════════════════════
function mostrarAviso(nombreFuncion) {
  document.getElementById('avisoNombreFuncion').textContent = nombreFuncion + '()';
  document.getElementById('avisoFlotante').classList.add('visible');
}

function cerrarAviso() {
  document.getElementById('avisoFlotante').classList.remove('visible');
}

// ══════════════════════════════════════
// EXPONER AL HTML
// ══════════════════════════════════════
window.agregarTarea             = agregarTarea;
window.agregarPrueba            = agregarPrueba;
window.evaluarFuncion           = evaluarFuncion;
window.cerrarAviso              = cerrarAviso;
window.actualizarContadorLineas = actualizarContadorLineas;
window.confirmarReemplazo       = confirmarReemplazo;
window.cancelarReemplazo        = cancelarReemplazo;
window._mostrarDetalle          = (id) => mostrarDetalleTarea({ id });

// ══════════════════════════════════════
// ARRANQUE
// ══════════════════════════════════════
cargarDatos();
