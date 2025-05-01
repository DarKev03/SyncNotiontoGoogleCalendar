import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import notionRoutes from './routes/auth';
import cookieParser from 'cookie-parser';
import User from './models/User';
import helmet from 'helmet';

dotenv.config();

const app = express();

const allowedOrigin = process.env.NODE_ENV === 'production'
  ? 'https://syncnotiontogooglecalendar-front.onrender.com'   // El dominio real en producción
  : 'http://localhost:3000';   // El dominio de desarrollo

app.use(cors({
  origin: allowedOrigin,
  credentials: true
}));
app.use(cookieParser());
app.use(express.json());

app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    styleSrc: ["'self'", "https://fonts.googleapis.com"],
    styleSrcElem: ["'self'", "https://fonts.googleapis.com"],
    fontSrc: ["'self'", "https://fonts.gstatic.com"],
    connectSrc: ["'self'", allowedOrigin], // ✅ aquí entra el frontend
    scriptSrc: ["'self'"],
    imgSrc: ["'self'"],
    baseUri: ["'self'"],
    formAction: ["'self'", allowedOrigin] // Por si hay algún submit implícito
  }
}));


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
