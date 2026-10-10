import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import TaskPriorityBadge from '../components/TaskPriorityBadge';
import TaskPrioritySelect from '../components/TaskPrioritySelect';
import TaskStatusBadge from '../components/TaskStatusBadge';
import TaskStatusSelect from '../components/TaskStatusSelect';
import { ESTADO_DEFAULT, PRIORIDAD_DEFAULT } from '../constants/taskOptions';
import '../components/taskMeta.css';
import './taskCreate.css';

export default function TaskCreate() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ titulo: '', descripcion: '' });
  const [estado, setEstado] = useState(ESTADO_DEFAULT);
  const [prioridad, setPrioridad] = useState(PRIORIDAD_DEFAULT);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      await api('/tasks', {
        method: 'POST',
        body: JSON.stringify({ ...form, estado, prioridad }),
      });
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="task-create">
      <header className="task-create-head">
        <p className="task-create-eyebrow">Registro</p>
        <h2>Nueva tarea</h2>
        <p>Escribe el título, una nota breve y elige el estado y la prioridad con los que entra al tablero.</p>
      </header>

      <form className="task-create-card" onSubmit={handleSubmit}>
        <label htmlFor="titulo">
          Título
          <input
            id="titulo"
            name="titulo"
            value={form.titulo}
            onChange={handleChange}
            placeholder="Ejemplo: Revisar el informe del viernes"
            required
            disabled={saving}
          />
        </label>

        <label htmlFor="descripcion">
          Descripción
          <textarea
            id="descripcion"
            name="descripcion"
            value={form.descripcion}
            onChange={handleChange}
            placeholder="Qué hay que hacer y cualquier detalle que el equipo deba saber."
            disabled={saving}
          />
        </label>

        <div className="task-create-grid">
          <TaskStatusSelect value={estado} onChange={setEstado} disabled={saving} />
          <TaskPrioritySelect value={prioridad} onChange={setPrioridad} disabled={saving} />
        </div>

        <div className="task-create-preview">
          <span className="task-create-preview-label">Así se verá</span>
          <TaskStatusBadge estado={estado} />
          <TaskPriorityBadge prioridad={prioridad} />
        </div>

        {error && (
          <p className="task-create-error" role="alert">
            {error}
          </p>
        )}

        <div className="task-create-actions">
          <button type="submit" disabled={saving}>
            {saving ? 'Guardando...' : 'Guardar tarea'}
          </button>
          <button
            type="button"
            className="task-create-cancel"
            onClick={() => navigate('/')}
            disabled={saving}
          >
            Cancelar
          </button>
        </div>
      </form>
    </section>
  );
}
