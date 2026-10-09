import { useState } from 'react';
import TaskPriorityBadge from '../components/TaskPriorityBadge';
import TaskPrioritySelect from '../components/TaskPrioritySelect';
import TaskStatusBadge from '../components/TaskStatusBadge';
import TaskStatusSelect from '../components/TaskStatusSelect';
import { ESTADO_DEFAULT, PRIORIDAD_DEFAULT } from '../constants/taskOptions';
import '../components/taskMeta.css';

export default function TaskCreate() {
  const [estado, setEstado] = useState(ESTADO_DEFAULT);
  const [prioridad, setPrioridad] = useState(PRIORIDAD_DEFAULT);

  return (
    <>
      <h2>Nueva tarea</h2>
      <form className="task-meta" onSubmit={(event) => event.preventDefault()}>
        <TaskStatusSelect value={estado} onChange={setEstado} />
        <TaskPrioritySelect value={prioridad} onChange={setPrioridad} />
        <div className="task-meta-preview">
          <TaskStatusBadge estado={estado} />
          <TaskPriorityBadge prioridad={prioridad} />
        </div>
      </form>
    </>
  );
}
