import express from 'express';
import cors from 'cors';
import routes from './routes/index.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', routes);

app.use((err, req, res, next) => {
  if (err?.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'El cuerpo de la petición no es válido' });
  }
  return next(err);
});

export default app;
