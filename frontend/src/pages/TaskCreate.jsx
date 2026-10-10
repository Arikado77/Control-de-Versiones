import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import TaskPriorityBadge from '../components/TaskPriorityBadge';
import TaskPrioritySelect from '../components/TaskPrioritySelect';
import TaskStatusBadge from '../components/TaskStatusBadge';
import TaskStatusSelect from '../components/TaskStatusSelect';
import { ESTADO_DEFAULT, PRIORIDAD_DEFAULT } from '../constants/taskOptions';
import '../components/taskMeta.css';

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
    <div>
      <h2>Nueva tarea</h2>
      <form className="task-meta" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="titulo">Título</label>
          <br />
          <input
            id="titulo"
            name="titulo"
            value={form.titulo}
            onChange={handleChange}
            required
            disabled={saving}
          />
        </div>
        <div>
          <label htmlFor="descripcion">Descripción</label>
          <br />
          <textarea
            id="descripcion"
            name="descripcion"
            value={form.descripcion}
            onChange={handleChange}
            disabled={saving}
          />
        </div>
        <TaskStatusSelect value={estado} onChange={setEstado} disabled={saving} />
        <TaskPrioritySelect value={prioridad} onChange={setPrioridad} disabled={saving} />
        <div className="task-meta-preview">
          <TaskStatusBadge estado={estado} />
          <TaskPriorityBadge prioridad={prioridad} />
        </div>
        {error && (
          <p className="task-meta-msg task-meta-error" role="alert">
            {error}
          </p>
        )}
        <button type="submit" disabled={saving}>
          {saving ? 'Guardando...' : 'Guardar tarea'}
        </button>
      </form>
    </div>
  );
}
