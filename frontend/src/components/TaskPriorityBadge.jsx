import { PRIORIDADES } from '../constants/taskOptions';

const CLASES = {
  Baja: 'badge-prioridad-baja',
  Media: 'badge-prioridad-media',
  Alta: 'badge-prioridad-alta',
};

export default function TaskPriorityBadge({ prioridad }) {
  const conocida = PRIORIDADES.includes(prioridad);
  const clase = conocida ? CLASES[prioridad] : 'badge-desconocido';

  return (
    <span className={`badge ${clase}`}>{conocida ? prioridad : 'Prioridad no válida'}</span>
  );
}
