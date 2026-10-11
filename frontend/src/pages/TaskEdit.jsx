import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../api/client';
import TaskPriorityBadge from '../components/TaskPriorityBadge';
import TaskPrioritySelect from '../components/TaskPrioritySelect';
import TaskStatusBadge from '../components/TaskStatusBadge';
import TaskStatusSelect from '../components/TaskStatusSelect';
import { ESTADO_DEFAULT, PRIORIDAD_DEFAULT } from '../constants/taskOptions';
import '../components/taskMeta.css';
import './taskCreate.css';

export default function TaskEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formulario, setFormulario] = useState({
    titulo: '',
    descripcion: '',
    estado: ESTADO_DEFAULT,
    prioridad: PRIORIDAD_DEFAULT,
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
          estado: tarea.estado ?? ESTADO_DEFAULT,
          prioridad: tarea.prioridad ?? PRIORIDAD_DEFAULT,
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

    setFormulario((prev) => ({
      ...prev,
      [name]: value,
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
        body: JSON.stringify(formulario),
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

  return (
    <section className="task-create">
      <header className="task-create-head">
        <p className="task-create-eyebrow">Edición</p>
        <h2>Modificar tarea</h2>
        <p>
          {cargando
            ? 'Cargando tarea...'
            : 'Actualiza el título, la nota, el estado o la prioridad. El cambio se guarda en la misma tarea.'}
        </p>
      </header>

      {!cargando && (
        <form className="task-create-card" onSubmit={guardarCambios}>
          <label htmlFor="titulo">
            Título
            <input
              id="titulo"
              type="text"
              name="titulo"
              value={formulario.titulo}
              onChange={manejarCambio}
              placeholder="Ejemplo: Revisar el informe del viernes"
              required
              disabled={guardando}
            />
          </label>

          <label htmlFor="descripcion">
            Descripción
            <textarea
              id="descripcion"
              name="descripcion"
              value={formulario.descripcion}
              onChange={manejarCambio}
              placeholder="Qué hay que hacer y cualquier detalle que el equipo deba saber."
              disabled={guardando}
            />
          </label>

          <div className="task-create-grid">
            <TaskStatusSelect
              value={formulario.estado}
              onChange={(valor) => setFormulario((prev) => ({ ...prev, estado: valor }))}
              disabled={guardando}
            />
            <TaskPrioritySelect
              value={formulario.prioridad}
              onChange={(valor) => setFormulario((prev) => ({ ...prev, prioridad: valor }))}
              disabled={guardando}
            />
          </div>

          <div className="task-create-preview">
            <span className="task-create-preview-label">Así se verá</span>
            <TaskStatusBadge estado={formulario.estado} />
            <TaskPriorityBadge prioridad={formulario.prioridad} />
          </div>

          {error && (
            <p className="task-create-error" role="alert">
              {error}
            </p>
          )}
          {mensaje && (
            <p className="task-create-success" role="status">
              {mensaje}
            </p>
          )}

          <div className="task-create-actions">
            <button type="submit" disabled={guardando}>
              {guardando ? 'Guardando...' : 'Guardar cambios'}
            </button>
            <button
              type="button"
              className="task-create-cancel"
              onClick={() => navigate('/')}
              disabled={guardando}
            >
              Cancelar
            </button>
          </div>
        </form>
      )}
    </section>
  );
}
