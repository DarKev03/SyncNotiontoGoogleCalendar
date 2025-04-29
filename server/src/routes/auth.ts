import { Router } from 'express';
import { redirectToNotion, handleNotionCallback } from '../controllers/notionController';
import { authGoogle, googleCallback } from '../controllers/googleController';
import { listDatabases } from '../controllers/notionController'; // AÑADES ESTA FUNCIÓN nueva que será la del listado de databases

const router: Router = Router();

// Notion
router.get('/notion', redirectToNotion);
router.get('/notion/callback', handleNotionCallback);
router.get('/databases', listDatabases); // 🚀 Nueva ruta aquí mismo

// Google
router.get('/google', authGoogle);
router.get('/google/callback', googleCallback);

export default router;
