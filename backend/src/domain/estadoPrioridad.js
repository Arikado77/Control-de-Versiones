export const ESTADOS = ['Pendiente', 'En proceso', 'Terminada'];
export const PRIORIDADES = ['Baja', 'Media', 'Alta'];

export const ESTADO_DEFAULT = 'Pendiente';
export const PRIORIDAD_DEFAULT = 'Media';

function cuerpoValido(body) {
  return body != null && typeof body === 'object' && !Array.isArray(body);
}

/**
 * Arma el objeto que sí puede escribirse en tareas.estado y tareas.prioridad.
 * No copia titulo, descripcion, responsable_id ni creado_en.
 * Si ninguno de los dos campos viene en el cuerpo, tieneCampos queda en false
 * para que el CRUD general conserve su propio flujo.
 */
export function extraerActualizacionEstadoPrioridad(body) {
  if (!cuerpoValido(body)) {
    return { ok: false, error: 'El cuerpo de la petición no es válido' };
  }

  const tieneEstado = Object.prototype.hasOwnProperty.call(body, 'estado');
  const tienePrioridad = Object.prototype.hasOwnProperty.call(body, 'prioridad');

  if (!tieneEstado && !tienePrioridad) {
    return { ok: true, tieneCampos: false, patch: {} };
  }

  const patch = {};

  if (tieneEstado) {
    if (!ESTADOS.includes(body.estado)) {
      return {
        ok: false,
        error: 'El estado debe ser Pendiente, En proceso o Terminada',
      };
    }
    patch.estado = body.estado;
  }

  if (tienePrioridad) {
    if (!PRIORIDADES.includes(body.prioridad)) {
      return {
        ok: false,
        error: 'La prioridad debe ser Baja, Media o Alta',
      };
    }
    patch.prioridad = body.prioridad;
  }

  return { ok: true, tieneCampos: true, patch };
}
