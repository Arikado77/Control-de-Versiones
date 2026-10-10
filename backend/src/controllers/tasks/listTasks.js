import { supabase } from '../../config/supabase.js';

const ESTADOS = ['Pendiente', 'En proceso', 'Terminada'];

// GET /api/tasks            -> todas las tareas
// GET /api/tasks?estado=... -> filtra por estado
// GET /api/tasks?responsable_id=... -> filtra por responsable
export const listTasks = async (req, res) => {
  try {
    const { estado, responsable_id } = req.query;

    if (estado && !ESTADOS.includes(estado)) {
      return res.status(400).json({
        error: `Estado inválido. Valores permitidos: ${ESTADOS.join(', ')}`,
      });
    }

    if (responsable_id && !/^\d+$/.test(responsable_id)) {
      return res.status(400).json({ error: 'responsable_id debe ser un número' });
    }

    let query = supabase
      .from('tareas')
      .select('*, responsable:usuarios(id, nombre, correo)')
      .order('creado_en', { ascending: false });

    if (estado) query = query.eq('estado', estado);
    if (responsable_id) query = query.eq('responsable_id', Number(responsable_id));

    const { data, error } = await query;

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};
