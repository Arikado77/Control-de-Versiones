import { useEffect, useState } from 'react';
import { api } from '../api/client';

const ESTADOS = ['Pendiente', 'En proceso', 'Terminada'];

export default function TaskFilters({
  estado,
  responsableId,
  onEstadoChange,
  onResponsableChange,
  onLimpiar,
  deshabilitado = false,
}) {
  const [responsables, setResponsables] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let activo = true;

    api('/users')
      .then((data) => {
        if (!activo) return;
        setResponsables(Array.isArray(data) ? data : []);
        setError('');
      })
      .catch((err) => {
        if (!activo) return;
        setResponsables([]);
        setError(err.message || 'No se pudieron cargar los responsables');
      })
      .finally(() => {
        if (activo) setCargando(false);
      });

    return () => {
      activo = false;
    };
  }, []);

  const sinFiltros = estado === 'Todas' && responsableId === '';

  return (
    <form className="task-filters" onSubmit={(event) => event.preventDefault()}>
      <label htmlFor="filtro-estado">
        Estado
        <select
          id="filtro-estado"
          value={estado}
          disabled={deshabilitado}
          onChange={(event) => onEstadoChange(event.target.value)}
        >
          <option value="Todas">Todas</option>
          {ESTADOS.map((opcion) => (
            <option key={opcion} value={opcion}>
              {opcion}
            </option>
          ))}
        </select>
      </label>

      <label htmlFor="filtro-responsable">
        Responsable
        <select
          id="filtro-responsable"
          value={responsableId}
          disabled={deshabilitado || cargando}
          onChange={(event) => onResponsableChange(event.target.value)}
        >
          <option value="">Todos</option>
          {responsables.map((persona) => (
            <option key={persona.id} value={String(persona.id)}>
              {persona.nombre}
            </option>
          ))}
        </select>
      </label>

      <button type="button" onClick={onLimpiar} disabled={deshabilitado || sinFiltros}>
        Limpiar filtros
      </button>

      {cargando && <p className="task-filters-msg">Cargando responsables…</p>}
      {error && (
        <p className="task-filters-msg task-filters-error" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
