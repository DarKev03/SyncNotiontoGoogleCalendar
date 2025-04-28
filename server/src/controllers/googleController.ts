import { google } from 'googleapis';
import { Request, Response } from 'express';
import User from '../models/User';

export const authGoogle = (req: Request, res: Response) => {
    const notion_user_id = req.query.notion_user_id as string;
    const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URI
    );

    const scopes = [
        'https://www.googleapis.com/auth/calendar',
        'https://www.googleapis.com/auth/userinfo.email'
    ];

    const url = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes,
        prompt: 'consent',
        state: notion_user_id
    });

    res.redirect(url);
};

export const googleCallback = async (req: Request, res: Response) => {
    const code = req.query.code as string;
    const notion_user_id = req.query.state as string;

    const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URI
    );

    const { tokens } = await oauth2Client.getToken(code);

    console.log('Tokens: ', tokens);

    // Buscar usuario en mongoDB            
    const user = await User.findOne({notion_user_id: notion_user_id});

    if (!user) {
        console.error('❌ Usuario no encontrado en la base de datos');
        res.status(404).send('Usuario no encontrado');
        return;
    }
    
    // Guardar el token de Google en la base de datos
    user.google_access_token = tokens.access_token!;
    user.google_refresh_token = tokens.refresh_token!;
    user.google_token_expires_at = tokens.expiry_date ? new Date(tokens.expiry_date) : undefined;
    await user.save();


    res.send('¡Autenticación de Google completada! Puedes cerrar esta ventana.');
    
};
