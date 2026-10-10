import { supabase } from '../../config/supabase.js';

export const createTask = async (req, res) => {
  const { titulo, descripcion, estado, prioridad, responsable_id } = req.body ?? {};

  if (!titulo || !titulo.trim()) {
    return res.status(400).json({ error: 'El título es obligatorio' });
  }

  // Solo se envían los campos que llegaron; la BD pone los valores por defecto
  // (estado "Pendiente", prioridad "Media").
  const nuevaTarea = { titulo: titulo.trim() };
  if (descripcion) nuevaTarea.descripcion = descripcion;
  if (estado) nuevaTarea.estado = estado;
  if (prioridad) nuevaTarea.prioridad = prioridad;
  if (responsable_id) nuevaTarea.responsable_id = responsable_id;

  const { data, error } = await supabase
    .from('tareas')
    .insert(nuevaTarea)
    .select()
    .single();

  if (error) {
    // 23514: valor fuera de los permitidos (estado o prioridad), 23503: responsable inexistente
    const status = ['23514', '23503'].includes(error.code) ? 400 : 500;
    return res.status(status).json({ error: error.message });
  }

  return res.status(201).json(data);
};