import { useEffect, useState } from 'react';
import { api } from '../api/client';
import TaskFilters from '../components/TaskFilters';
import '../components/taskFilters.css';

export default function TaskList() {
  const [estado, setEstado] = useState('Todas');
  const [responsableId, setResponsableId] = useState('');
  const [tareas, setTareas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  function cambiarEstado(valor) {
    setCargando(true);
    setError('');
    setEstado(valor);
  }

  function cambiarResponsable(valor) {
    setCargando(true);
    setError('');
    setResponsableId(valor);
  }

  function limpiar() {
    setCargando(true);
    setError('');
    setEstado('Todas');
    setResponsableId('');
  }

  useEffect(() => {
    let activo = true;
    const params = new URLSearchParams();
    if (estado !== 'Todas') params.set('estado', estado);
    if (responsableId) params.set('responsable_id', responsableId);
    const consulta = params.toString();

    api(`/tasks${consulta ? `?${consulta}` : ''}`)
      .then((data) => {
        if (activo) setTareas(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        if (!activo) return;
        setTareas([]);
        setError(err.message || 'No se pudieron consultar las tareas');
      })
      .finally(() => {
        if (activo) setCargando(false);
      });

    return () => {
      activo = false;
    };
  }, [estado, responsableId]);

  return (
    <>
      <h2>Lista de tareas</h2>
      <TaskFilters
        estado={estado}
        responsableId={responsableId}
        onEstadoChange={cambiarEstado}
        onResponsableChange={cambiarResponsable}
        onLimpiar={limpiar}
        deshabilitado={cargando}
      />
      {cargando && <p className="task-filters-msg">Cargando tareas…</p>}
      {error && (
        <p className="task-filters-msg task-filters-error" role="alert">
          {error}
        </p>
      )}
      {!cargando && !error && tareas.length === 0 && (
        <p className="task-filters-msg">No hay tareas con esos filtros.</p>
      )}
      {!cargando && !error && tareas.length > 0 && (
        <ul className="task-filters-list">
          {tareas.map((tarea) => {
            const nombre = tarea.responsable?.nombre;
            return (
              <li key={tarea.id}>
                <strong>{tarea.titulo}</strong>
                <span>{tarea.estado}</span>
                <span className={nombre ? undefined : 'sin-responsable'}>
                  {nombre || 'Sin responsable'}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
