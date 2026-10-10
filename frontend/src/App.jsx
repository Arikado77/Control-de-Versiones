import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import TaskList from './pages/TaskList';
import TaskCreate from './pages/TaskCreate';
import TaskEdit from './pages/TaskEdit';

export default function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Tareas</Link> | <Link to="/nueva">Nueva tarea</Link>
      </nav>
      <Routes>
        <Route path="/" element={<TaskList />} />
        <Route path="/nueva" element={<TaskCreate />} />
        <Route path="/editar/:id" element={<TaskEdit />} />
      </Routes>
    </BrowserRouter>
  );
}
