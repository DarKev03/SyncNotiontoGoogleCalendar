const axios = require('axios');
const User = require('../models/User');

const redirectToNotion = (req, res) => {
  const params = new URLSearchParams({
    client_id: process.env.NOTION_CLIENT_ID,
    response_type: 'code',
    owner: 'user',
    redirect_uri: process.env.NOTION_REDIRECT_URI
  });

  res.redirect(`https://api.notion.com/v1/oauth/authorize?${params.toString()}`);
};

const handleNotionCallback = async (req, res) => {
  const code = req.query.code;

  if (!code) {
    return res.status(400).send('Falta el código de autorización');
  }

  try {
    // Intercambiar el code por access_token
    const response = await axios.post('https://api.notion.com/v1/oauth/token', {
      grant_type: 'authorization_code',
      code,
      redirect_uri: process.env.NOTION_REDIRECT_URI
    }, {
      auth: {
        username: process.env.NOTION_CLIENT_ID,
        password: process.env.NOTION_CLIENT_SECRET
      },
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const { access_token, bot_id, workspace_id, owner } = response.data;

    // Guardar token en Mongo
    const newUser = await User.create({
      notion_access_token: access_token,
      notion_user_id: owner?.user?.id || 'unknown',
      google_access_token: 'google_dummy_for_now'
    });

    console.log('✅ Token de Notion guardado en la base de datos');

    res.send('¡Integración con Notion completada! Puedes cerrar esta pestaña.');
  } catch (error) {
    console.error('❌ Error en el callback de Notion:', error.response?.data || error.message);
    res.status(500).send('Error al conectar con Notion');
  }
};

module.exports = {
  redirectToNotion,
  handleNotionCallback
};
