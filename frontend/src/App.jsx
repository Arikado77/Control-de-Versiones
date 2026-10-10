import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import TaskCreate from './pages/TaskCreate';
import TaskEdit from './pages/TaskEdit';
import TaskList from './pages/TaskList';
import './appShell.css';

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <header className="app-bar">
          <div className="app-bar-inner">
            <NavLink to="/" className="brand" end>
              <span className="brand-mark" aria-hidden="true">
                T
              </span>
              <span className="brand-text">
                <strong>Tareas</strong>
                <small>Equipo de trabajo</small>
              </span>
            </NavLink>
            <nav className="app-nav" aria-label="Principal">
              <NavLink to="/" end>
                Consultar
              </NavLink>
              <NavLink to="/nueva">Nueva tarea</NavLink>
            </nav>
          </div>
        </header>
        <main className="app-main">
          <Routes>
            <Route path="/" element={<TaskList />} />
            <Route path="/nueva" element={<TaskCreate />} />
            <Route path="/editar/:id" element={<TaskEdit />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
