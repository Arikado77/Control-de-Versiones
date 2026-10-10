import { supabase } from '../../config/supabase.js';

export const listUsers = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('usuarios')
      .select('id, nombre')
      .order('nombre', { ascending: true });

    if (error) {
      return res.status(500).json({ error: 'No se pudieron consultar los responsables' });
    }

    return res.status(200).json(data ?? []);
  } catch {
    return res.status(500).json({ error: 'No se pudieron consultar los responsables' });
  }
};
