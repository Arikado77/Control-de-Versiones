
import { supabase } from '../../config/supabase.js';

// PUT /api/tasks/:id
// Controlador para modificar una tarea existente
export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Validar el ID de la tarea
    if (
      !/^\d+$/.test(id) ||
      !Number.isSafeInteger(Number(id)) ||
      Number(id) <= 0
    ) {
      return res.status(400).json({
        error: 'El ID de la tarea debe ser un número válido'
      });
    }

    // 2. Definir los campos que se pueden modificar
    const camposPermitidos = [
      'titulo',
      'descripcion',
      'estado',
      'prioridad',
      'responsable_id'
    ];

    // 3. Validar los datos recibidos
    if (
      !req.body ||
      typeof req.body !== 'object' ||
      Array.isArray(req.body)
    ) {
      return res.status(400).json({
        error: 'Debes enviar los datos de la tarea'
      });
    }

    const camposRecibidos = Object.keys(req.body);

    if (camposRecibidos.length === 0) {
      return res.status(400).json({
        error: 'No se enviaron datos para modificar'
      });
    }

    // 4. Verificar los campos permitidos
    const camposInvalidos = camposRecibidos.filter(
      campo => !camposPermitidos.includes(campo)
    );

    if (camposInvalidos.length > 0) {
      return res.status(400).json({
        error: `Campos no permitidos: ${camposInvalidos.join(', ')}`
      });
    }

    // 5. Preparar los cambios
    const cambios = {};

    for (const campo of camposRecibidos) {
      cambios[campo] = req.body[campo];
    }

    // 6. Validar el título
    if ('titulo' in cambios) {
      if (
        typeof cambios.titulo !== 'string' ||
        !cambios.titulo.trim()
      ) {
        return res.status(400).json({
          error: 'El título no puede estar vacío'
        });
      }

      cambios.titulo = cambios.titulo.trim();
    }

    // 7. Validar la descripción
    if (
      'descripcion' in cambios &&
      cambios.descripcion !== null &&
      typeof cambios.descripcion !== 'string'
    ) {
      return res.status(400).json({
        error: 'La descripción debe ser texto'
      });
    }

    // 8. Validar el estado
    const estadosValidos = [
      'Pendiente',
      'En proceso',
      'Terminada'
    ];

    if (
      'estado' in cambios &&
      !estadosValidos.includes(cambios.estado)
    ) {
      return res.status(400).json({
        error: 'Estado no válido'
      });
    }

    // 9. Validar la prioridad
    const prioridadesValidas = [
      'Baja',
      'Media',
      'Alta'
    ];

    if (
      'prioridad' in cambios &&
      !prioridadesValidas.includes(cambios.prioridad)
    ) {
      return res.status(400).json({
        error: 'Prioridad no válida'
      });
    }

    // 10. Validar el responsable
    if ('responsable_id' in cambios) {
      const responsable = cambios.responsable_id;

      if (
        responsable !== null &&
        (
          !Number.isSafeInteger(responsable) ||
          responsable <= 0
        )
      ) {
        return res.status(400).json({
          error: 'El ID del responsable debe ser válido'
        });
      }
    }

    // 11. Actualizar la tarea en Supabase
    const { data, error } = await supabase
      .from('tareas')
      .update(cambios)
      .eq('id', Number(id))
      .select()
      .maybeSingle();

    // 12. Manejar errores de Supabase
    if (error) {
      console.error('Error al actualizar tarea:', error);

      return res.status(500).json({
        error: 'No se pudo actualizar la tarea'
      });
    }

    // 13. Verificar si la tarea existe
    if (!data) {
      return res.status(404).json({
        error: 'Tarea no encontrada o sin acceso'
      });
    }

    // 14. Responder con la tarea actualizada
    return res.status(200).json({
      mensaje: 'Tarea modificada correctamente',
      tarea: data
    });

  } catch (error) {
    console.error('Error interno al modificar tarea:', error);

    return res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
};
