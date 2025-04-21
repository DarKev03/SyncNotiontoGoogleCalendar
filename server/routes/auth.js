const express = require('express');
const router = express.Router();
const {
  redirectToNotion,
  handleNotionCallback
} = require('../controllers/notionController');

// Ruta para iniciar login con Notion
router.get('/notion', redirectToNotion);

// Ruta de callback de Notion
router.get('/notion/callback', handleNotionCallback);

module.exports = router;
