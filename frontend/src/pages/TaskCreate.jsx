import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';

export default function TaskCreate() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ titulo: '', descripcion: '' });
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
      await api('/tasks', { method: 'POST', body: JSON.stringify(form) });
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
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="titulo">Título</label>
          <br />
          <input
            id="titulo"
            name="titulo"
            value={form.titulo}
            onChange={handleChange}
            required
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
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" disabled={saving}>
          {saving ? 'Guardando...' : 'Guardar tarea'}
        </button>
      </form>
    </div>
  );
}