import { supabase } from '../../config/supabase.js';

// GET /api/tasks/:id
export const getTask = async (req, res) => {
  try {
    const { id } = req.params;

    if (!/^\d+$/.test(id)) {
      return res.status(400).json({ error: 'El id debe ser un número' });
    }

    const { data, error } = await supabase
      .from('tareas')
      .select('*, responsable:usuarios(id, nombre, correo)')
      .eq('id', Number(id))
      .maybeSingle();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    if (!data) {
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }

    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};
