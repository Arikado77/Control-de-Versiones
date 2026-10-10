import { ESTADOS } from '../constants/taskOptions';

const CLASES = {
  Pendiente: 'badge-estado-pendiente',
  'En proceso': 'badge-estado-en-proceso',
  Terminada: 'badge-estado-terminada',
};

export default function TaskStatusBadge({ estado }) {
  const conocido = ESTADOS.includes(estado);
  const clase = conocido ? CLASES[estado] : 'badge-desconocido';

  return <span className={`badge ${clase}`}>{conocido ? estado : 'Estado no válido'}</span>;
}
