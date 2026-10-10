/*export default function TaskEdit() {
  return <h2>Editar tarea</h2>;
}*/

import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../api/client';

export default function TaskEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formulario, setFormulario] = useState({
    titulo: '',
    descripcion: '',
    estado: 'Pendiente',
    prioridad: 'Media'
  });

  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    let activo = true;

    async function cargarTarea() {
      try {
        const tarea = await api(`/tasks/${id}`);

        if (!activo) return;

        setFormulario({
          titulo: tarea.titulo ?? '',
          descripcion: tarea.descripcion ?? '',
          estado: tarea.estado ?? 'Pendiente',
          prioridad: tarea.prioridad ?? 'Media'
        });
      } catch (err) {
        if (activo) setError(err.message);
      } finally {
        if (activo) setCargando(false);
      }
    }

    cargarTarea();

    return () => {
      activo = false;
    };
  }, [id]);

  function manejarCambio(e) {
    const { name, value } = e.target;

    setFormulario(prev => ({
      ...prev,
      [name]: value
    }));
  }

  async function guardarCambios(e) {
    e.preventDefault();
    setError('');
    setMensaje('');

    if (!formulario.titulo.trim()) {
      setError('El título es obligatorio');
      return;
    }

    setGuardando(true);

    try {
      await api(`/tasks/${id}`, {
        method: 'PUT',
        body: JSON.stringify(formulario)
      });

      setMensaje('Tarea modificada correctamente');

      setTimeout(() => {
        navigate('/');
      }, 1000);
    } catch (err) {
      setError(err.message);
    } finally {
      setGuardando(false);
    }
  }

  if (cargando) {
    return <p>Cargando tarea...</p>;
  }

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto' }}>
      <h2>Modificar tarea</h2>

      {error && <p role="alert" style={{ color: 'red' }}>{error}</p>}
      {mensaje && <p role="status" style={{ color: 'green' }}>{mensaje}</p>}

      <form onSubmit={guardarCambios}>
        <div>
          <label htmlFor="titulo">Título</label>
          <input
            id="titulo"
            type="text"
            name="titulo"
            value={formulario.titulo}
            onChange={manejarCambio}
            required
          />
        </div>

        <div>
          <label htmlFor="descripcion">Descripción</label>
          <textarea
            id="descripcion"
            name="descripcion"
            value={formulario.descripcion}
            onChange={manejarCambio}
          />
        </div>

        <div>
          <label htmlFor="estado">Estado</label>
          <select
            id="estado"
            name="estado"
            value={formulario.estado}
            onChange={manejarCambio}
          >
            <option value="Pendiente">Pendiente</option>
            <option value="En proceso">En proceso</option>
            <option value="Terminada">Terminada</option>
          </select>
        </div>

        <div>
          <label htmlFor="prioridad">Prioridad</label>
          <select
            id="prioridad"
            name="prioridad"
            value={formulario.prioridad}
            onChange={manejarCambio}
          >
            <option value="Baja">Baja</option>
            <option value="Media">Media</option>
            <option value="Alta">Alta</option>
          </select>
        </div>

        <div style={{ marginTop: '20px' }}>
          <button type="submit" disabled={guardando}>
            {guardando ? 'Guardando...' : 'Guardar cambios'}
          </button>

          <button
            type="button"
            onClick={() => navigate('/')}
            style={{ marginLeft: '10px' }}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
