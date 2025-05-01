import { Request, Response } from 'express';
import axios from 'axios';
import User, { IUser } from '../models/User';

export const redirectToNotion = (req: Request, res: Response): void => {
  const params = new URLSearchParams({
    client_id: process.env.NOTION_CLIENT_ID as string,
    response_type: 'code',
    owner: 'user',
    redirect_uri: process.env.NOTION_REDIRECT_URI as string,
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

    const user = User.findOne({ notion_user_id: owner?.user?.id })

    if (!user) {
      await User.create({
        notion_access_token: access_token,
        notion_user_id: owner?.user?.id || 'unknown',
      });
      console.log('✅ Usuario creado en la base de datos');
      console.log('✅ Token de Notion guardado en la base de datos');
    }

    res.redirect(`${process.env.GOOGLE_AUTH}?notion_user_id=${owner?.user?.id}`);
    console.log('✅ Redirigiendo a la autenticación de Google');
  } catch (error: any) {
    console.error('❌ Error en el callback de Notion:', error.response?.data || error.message);
    res.status(500).send('Error al conectar con Notion');
  }
};

export const listDatabases = async (req: Request, res: Response): Promise<void> => {
  // Verificamos si el usuario está autenticado
  const nodeEnv = process.env.NODE_ENV;  
  const notion_user_id = req.cookies.user_token as string;
  const user = await User.findOne({ notion_user_id });

  console.log('ID de las cookies:', notion_user_id);
  console.log('Entorno de producción:', nodeEnv);

  if (!user) {
    res.status(404).send('Usuario no encontrado. Sincroniza tu cuenta de Notion');
    console.error('❌ Usuario no encontrado en la base de datos');
    return;
  }

  try {
    const response = await axios.post(
      'https://api.notion.com/v1/search',
      {
        filter: {
          property: 'object',
          value: 'database'
        }
      },
      {
        headers: {
          Authorization: `Bearer ${user.notion_access_token}`,
          'Notion-Version': '2022-06-28',
          'Content-Type': 'application/json',
        }
      }
    );

    response.data.results && response.data.results.length > 0 ? console.log('✅ Bases de datos obtenidas:') : console.log('❌ No se encontraron bases de datos');

    res.json(response.data.results); // Envías solo las bases de datos
  } catch (error: any) {
    console.error('❌ Error al listar bases de datos:', error.response?.data || error.message);
    res.status(500).send('Error al listar bases de datos');
  }
};