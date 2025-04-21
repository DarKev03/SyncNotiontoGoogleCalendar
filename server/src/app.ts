import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import notionRoutes from './routes/auth';
import User from './models/User';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Rutas de Notion
app.use('/auth', notionRoutes);

// Ruta de prueba
app.get('/api/ping', (_req: Request, res: Response) => {
  res.json({ msg: 'pong desde el backend 🛠️' });
});

// Ruta para probar la conexión con MongoDB
app.get('/api/test-user', async (_req: Request, res: Response) => {
  try {
    const newUser = await User.create({
      notion_access_token: 'notion_token_de_prueba',
      google_access_token: 'google_token_de_prueba'
    });

    res.json(newUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear usuario' });
  }
});

export default app;
