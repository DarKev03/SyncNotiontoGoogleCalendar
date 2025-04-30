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
        prompt: 'consent',
        scope: scopes,
        state: notion_user_id
    });

    res.redirect(url);
};

export const googleCallback = async (req: Request, res: Response) => {
    const code = req.query.code as string;
    const notion_user_id = req.query.state as string;

    console.log("CLIENT_ID:", process.env.GOOGLE_CLIENT_ID);
    console.log("CLIENT_SECRET:", process.env.GOOGLE_CLIENT_SECRET);
    console.log("REDIRECT_URI:", process.env.GOOGLE_REDIRECT_URI);
    console.log('🔁 Código recibido:', code);
    console.log('👤 Notion User ID:', notion_user_id);

    const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URI
    );

    try {
        const { tokens } = await oauth2Client.getToken(code);
        console.log('✅ Tokens de Google recibidos:', tokens);

        // Buscar usuario en la base de datos
        const user = await User.findOne({ notion_user_id });

        if (!user) {
            console.error('❌ Usuario no encontrado en MongoDB');
            return res.status(404).send('Usuario no encontrado');
        }

        // Guardar tokens en el usuario
        user.google_access_token = tokens.access_token!;
        user.google_refresh_token = tokens.refresh_token!;
        user.google_token_expires_at = tokens.expiry_date ? new Date(tokens.expiry_date) : undefined;
        await user.save();

        // Cookie segura para mantener sesión
        res.cookie('user_token', notion_user_id, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 1000 * 60 * 60 * 24 * 30 // 30 días
        });

        // Redirigir al frontend
        return res.redirect(
            process.env.NODE_ENV === 'production'
                ? 'https://syncnotiontogooglecalendar-front.onrender.com'
                : 'http://localhost:3000'
        );
    } catch (err: any) {
        console.error('💥 Error al intercambiar el code por tokens:', err.response?.data || err.message);
        return res.status(500).send('Fallo en el token exchange con Google');
    }
};
