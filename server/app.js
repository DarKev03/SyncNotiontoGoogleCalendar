const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors()); // <- ¡esto es clave!
app.use(express.json());

app.get('/api/ping', (req, res) => {
  res.json({ msg: 'pong desde el backend 🛠️' });
});

module.exports = app;
 