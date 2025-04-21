const express = require('express');
const cors = require('cors');
const User = require('./models/User');
require('dotenv').config();

const app = express();

app.use(cors()); // <- ¡esto es clave!
app.use(express.json());

app.get('/api/ping', (req, res) => {
  res.json({ msg: 'pong desde el backend 🛠️' });
});

app.get('/api/test-user', async (req, res) => {
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

module.exports = app;
