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

    console.log("👉 Callback recibido");
    console.log("🔑 Código recibido de Google:", code);
    console.log("🧠 Notion User ID recibido:", notion_user_id);

    const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URI
    );

    try {
        const { tokens } = await oauth2Client.getToken(code);
        console.log('✅ Tokens de Google:', tokens);

        // Buscar usuario en MongoDB
        const user = await User.findOne({ notion_user_id });

        if (!user) {
            console.error('❌ Usuario no encontrado en la base de datos');
            return res.status(404).send('Usuario no encontrado');
        }

        // Guardar tokens de Google en el usuario
        user.google_access_token = tokens.access_token!;
        user.google_refresh_token = tokens.refresh_token!;
        user.google_token_expires_at = tokens.expiry_date ? new Date(tokens.expiry_date) : undefined;
        await user.save();
        console.log('💾 Tokens de Google guardados en la base de datos');

        // Setear cookie de sesión
        res.cookie('user_token', notion_user_id, {
            httpOnly: true,
            secure: true, // obligatorio con SameSite: 'none'
            sameSite: 'none',
            maxAge: 1000 * 60 * 60 * 24 * 30 // 30 días
        });

        console.log('🍪 Cookie "user_token" seteada');
        console.log('🔐 Headers de respuesta:', res.getHeaders());

        // Redirigir al frontend
        const frontendUrl = process.env.NODE_ENV === 'production'
            ? 'https://syncnotiontogooglecalendar-front.onrender.com'
            : 'http://localhost:3000';

        console.log('➡️ Redirigiendo al frontend:', frontendUrl);
        return res.redirect(frontendUrl);
    } catch (error: any) {
        console.error('💥 Error en el callback de Google:', error.response?.data || error.message);
        return res.status(500).send('Error procesando el callback de Google');
    }
};
