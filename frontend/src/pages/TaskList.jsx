import { useEffect, useState } from 'react';
import { api } from '../api/client';
import TaskFilters from '../components/TaskFilters';
import '../components/taskFilters.css';

function claseEstado(estado) {
  if (estado === 'Pendiente') return 'chip chip-pendiente';
  if (estado === 'En proceso') return 'chip chip-proceso';
  if (estado === 'Terminada') return 'chip chip-terminada';
  return 'chip chip-otro';
}

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

  const sinFiltros = estado === 'Todas' && responsableId === '';
  const cantidad = tareas.length;

  return (
    <section className="board">
      <header className="board-head">
        <p className="eyebrow">Consulta</p>
        <h2>Lista de tareas</h2>
        <p>Filtra por estado, por responsable o por los dos a la vez.</p>
      </header>

      <TaskFilters
        estado={estado}
        responsableId={responsableId}
        onEstadoChange={cambiarEstado}
        onResponsableChange={cambiarResponsable}
        onLimpiar={limpiar}
        deshabilitado={cargando}
      />

      <div className="results-bar">
        <span>{cargando ? 'Buscando…' : `${cantidad} ${cantidad === 1 ? 'tarea' : 'tareas'}`}</span>
        <span>{sinFiltros ? 'Sin filtros' : 'Filtro activo'}</span>
      </div>

      {cargando && (
        <div className="skeleton-list" aria-hidden="true">
          <div className="skeleton-card" />
          <div className="skeleton-card" />
          <div className="skeleton-card" />
        </div>
      )}

      {!cargando && error && (
        <div className="task-filters-error-panel" role="alert">
          <p>{error}</p>
        </div>
      )}

      {!cargando && !error && cantidad === 0 && (
        <div className="empty-state">
          <span className="empty-mark" aria-hidden="true">
            ∅
          </span>
          <h3>{sinFiltros ? 'Todavía no hay tareas' : 'Ninguna tarea coincide'}</h3>
          <p>
            {sinFiltros
              ? 'Cuando el equipo registre tareas, aparecerán en este tablero.'
              : 'Prueba con otro estado o limpia los filtros para ver el listado completo.'}
          </p>
        </div>
      )}

      {!cargando && !error && cantidad > 0 && (
        <ul className="task-filters-list">
          {tareas.map((tarea) => {
            const nombre = tarea.responsable?.nombre;
            return (
              <li key={tarea.id} className="task-card">
                <div>
                  <strong>{tarea.titulo}</strong>
                  {tarea.descripcion && <p>{tarea.descripcion}</p>}
                </div>
                <span className={claseEstado(tarea.estado)}>{tarea.estado}</span>
                <span className={nombre ? 'responsable' : 'responsable sin-responsable'}>
                  {nombre || 'Sin responsable'}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
