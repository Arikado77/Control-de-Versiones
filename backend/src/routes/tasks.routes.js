import { Router } from 'express';
import { createTask } from '../controllers/tasks/createTask.js';
import { listTasks } from '../controllers/tasks/listTasks.js';
import { getTask } from '../controllers/tasks/getTask.js';
import { updateTask } from '../controllers/tasks/updateTask.js';
import { deleteTask } from '../controllers/tasks/deleteTask.js';

const router = Router();
router.get('/', listTasks);        // admite ?estado= y ?responsable_id=
router.post('/', createTask);
router.get('/:id', getTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

export default router;