import { PRIORIDADES } from '../constants/taskOptions';

export default function TaskPrioritySelect({
  value,
  onChange,
  id = 'prioridad',
  name = 'prioridad',
  disabled = false,
}) {
  return (
    <label htmlFor={id}>
      Prioridad
      <select
        id={id}
        name={name}
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
      >
        {PRIORIDADES.map((prioridad) => (
          <option key={prioridad} value={prioridad}>
            {prioridad}
          </option>
        ))}
      </select>
    </label>
  );
}
