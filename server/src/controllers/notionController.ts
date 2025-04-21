import { Request, Response } from 'express';
import axios from 'axios';
import User, { IUser } from '../models/User';

export const redirectToNotion = (req: Request, res: Response): void => {
  const params = new URLSearchParams({
    client_id: process.env.NOTION_CLIENT_ID as string,
    response_type: 'code',
    owner: 'user',
    redirect_uri: process.env.NOTION_REDIRECT_URI as string
  });

  res.redirect(`https://api.notion.com/v1/oauth/authorize?${params.toString()}`);
};

export const handleNotionCallback = async (req: Request, res: Response): Promise<void> => {
  const code = req.query.code as string;

  if (!code) {
    res.status(400).send('Falta el código de autorización');
    return;
  }

  try {
    const response = await axios.post('https://api.notion.com/v1/oauth/token', {
      grant_type: 'authorization_code',
      code,
      redirect_uri: process.env.NOTION_REDIRECT_URI as string
    }, {
      auth: {
        username: process.env.NOTION_CLIENT_ID as string,
        password: process.env.NOTION_CLIENT_SECRET as string
      },
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const { access_token, owner } = response.data;

    await User.create({
      notion_access_token: access_token,
      notion_user_id: owner?.user?.id || 'unknown',
      google_access_token: 'google_dummy_for_now'
    });

    console.log('✅ Token de Notion guardado en la base de datos');

    res.send('¡Integración con Notion completada! Puedes cerrar esta pestaña.');
  } catch (error: any) {
    console.error('❌ Error en el callback de Notion:', error.response?.data || error.message);
    res.status(500).send('Error al conectar con Notion');
  }
};
