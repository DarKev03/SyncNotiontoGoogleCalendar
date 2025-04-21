import { Router } from 'express';
import { redirectToNotion, handleNotionCallback } from '../controllers/notionController';

const router: Router = Router();

// Ruta para iniciar login con Notion
router.get('/notion', redirectToNotion);

// Ruta de callback de Notion
router.get('/notion/callback', handleNotionCallback);

export default router;
