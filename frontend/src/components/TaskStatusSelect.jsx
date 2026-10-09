import { ESTADOS } from '../constants/taskOptions';

export default function TaskStatusSelect({
  value,
  onChange,
  id = 'estado',
  name = 'estado',
  disabled = false,
}) {
  return (
    <label htmlFor={id}>
      Estado
      <select
        id={id}
        name={name}
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
      >
        {ESTADOS.map((estado) => (
          <option key={estado} value={estado}>
            {estado}
          </option>
        ))}
      </select>
    </label>
  );
}
