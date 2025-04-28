import { Router } from 'express';
import { redirectToNotion, handleNotionCallback } from '../controllers/notionController';
import { authGoogle, googleCallback } from '../controllers/googleController';

const router: Router = Router();

// Notion
router.get('/notion', redirectToNotion);
router.get('/notion/callback', handleNotionCallback);

// Google
router.get('/google', authGoogle);
router.get('/google/callback', googleCallback);

export default router;
