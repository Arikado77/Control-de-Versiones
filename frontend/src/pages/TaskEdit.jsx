import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../api/client';
import TaskPriorityBadge from '../components/TaskPriorityBadge';
import TaskPrioritySelect from '../components/TaskPrioritySelect';
import TaskStatusBadge from '../components/TaskStatusBadge';
import TaskStatusSelect from '../components/TaskStatusSelect';
import { ESTADO_DEFAULT, PRIORIDAD_DEFAULT } from '../constants/taskOptions';
import '../components/taskMeta.css';

export default function TaskEdit() {
  const { id } = useParams();
  const [estado, setEstado] = useState(ESTADO_DEFAULT);
  const [prioridad, setPrioridad] = useState(PRIORIDAD_DEFAULT);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    let activo = true;

    api(`/tasks/${id}`)
      .then((tarea) => {
        if (!activo || !tarea) return;
        if (tarea.estado) setEstado(tarea.estado);
        if (tarea.prioridad) setPrioridad(tarea.prioridad);
        setError('');
      })
      .catch((err) => {
        if (!activo) return;
        const detalle = err.message === 'No implementado'
          ? 'Todavía no se puede consultar la tarea. Se muestran los valores predeterminados.'
          : err.message;
        setError(detalle || 'No se pudo consultar la tarea');
      })
      .finally(() => {
        if (activo) setCargando(false);
      });

    return () => {
      activo = false;
    };
  }, [id]);

  async function guardar(event) {
    event.preventDefault();
    setGuardando(true);
    setMensaje('');
    setError('');

    try {
      const tarea = await api(`/tasks/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ estado, prioridad }),
      });
      if (tarea?.estado) setEstado(tarea.estado);
      if (tarea?.prioridad) setPrioridad(tarea.prioridad);
      setMensaje('Estado y prioridad actualizados');
    } catch (err) {
      setError(err.message || 'No se pudo actualizar la tarea');
    } finally {
      setGuardando(false);
    }
  }

  return (
    <>
      <h2>Editar tarea</h2>
      <form className="task-meta" onSubmit={guardar}>
        <TaskStatusSelect value={estado} onChange={setEstado} disabled={guardando} />
        <TaskPrioritySelect value={prioridad} onChange={setPrioridad} disabled={guardando} />
        <div className="task-meta-preview">
          <TaskStatusBadge estado={estado} />
          <TaskPriorityBadge prioridad={prioridad} />
        </div>
        <button type="submit" disabled={cargando || guardando}>
          {guardando ? 'Guardando…' : 'Guardar estado y prioridad'}
        </button>
        {cargando && <p className="task-meta-msg">Cargando tarea…</p>}
        {mensaje && <p className="task-meta-msg">{mensaje}</p>}
        {error && (
          <p className="task-meta-msg task-meta-error" role="alert">
            {error}
          </p>
        )}
      </form>
    </>
  );
}
