import { supabase } from '../../config/supabase.js';

export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(Number(id))) {
      return res
        .status(400)
        .json({ error: 'El id de la tarea es requerido y debe ser numérico' });
    }

    const { data, error } = await supabase
      .from('tareas')
      .delete()
      .eq('id', Number(id))
      .select();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    if (!data || data.length === 0) {
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }

    return res.status(200).json({
      message: 'Tarea eliminada correctamente',
      tarea: data[0],
    });
  } catch (err) {
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};