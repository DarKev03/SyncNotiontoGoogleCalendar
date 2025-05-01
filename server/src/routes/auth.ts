import { Router } from 'express';
import { redirectToNotion, handleNotionCallback } from '../controllers/notionController';
import { authGoogle, googleCallback } from '../controllers/googleController';
import { listDatabases } from '../controllers/notionController'; // AÑADES ESTA FUNCIÓN nueva que será la del listado de databases
import { setCookie } from '../controllers/cookieController';

const router: Router = Router();

// Notion
router.get('/notion', redirectToNotion);
router.get('/notion/callback', handleNotionCallback);
router.get('/databases-test', listDatabases);

// Google
router.get('/google', authGoogle);
router.get('/google/callback', googleCallback);

// Cookies
router.get('/cookie', setCookie);

export default router;
