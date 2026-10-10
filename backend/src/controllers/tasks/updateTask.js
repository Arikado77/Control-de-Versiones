import { extraerActualizacionEstadoPrioridad } from '../../domain/estadoPrioridad.js';

function idValido(id) {
  return typeof id === 'string' && /^[1-9]\d*$/.test(id);
}

export const updateTask = async (req, res) => {
  if (!idValido(req.params?.id)) {
    return res.status(400).json({ error: 'Identificador de tarea no válido' });
  }

  const resultado = extraerActualizacionEstadoPrioridad(
    req.body === undefined ? {} : req.body,
  );
  if (!resultado.ok) {
    return res.status(400).json({ error: resultado.error });
  }

  // Punto de integración: titulo, descripcion y responsable_id siguen en el CRUD general.
  if (!resultado.tieneCampos) {
    return res.status(501).json({ error: 'No implementado' });
  }

  try {
    const { supabase } = await import('../../config/supabase.js');
    const { data, error } = await supabase
      .from('tareas')
      .update(resultado.patch)
      .eq('id', req.params.id)
      .select('id, titulo, descripcion, estado, prioridad, responsable_id, creado_en')
      .maybeSingle();

    if (error) {
      return res.status(500).json({ error: 'No se pudo actualizar el estado o la prioridad' });
    }
    if (!data) {
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }
    return res.json(data);
  } catch {
    return res.status(500).json({ error: 'No se pudo actualizar el estado o la prioridad' });
  }
};
