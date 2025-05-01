import { Request, Response } from 'express';

export const setCookie = (req: Request, res: Response) => {
    const {notion_user_id} = req.query;  
    try {
        res.cookie('user_token', notion_user_id, {
            httpOnly: true,
            secure: true, // obligatorio con SameSite: 'none'
            sameSite: 'none', // esto permite enviar cookies en cross-site
            maxAge: 1000 * 60 * 60 * 24 * 30 // 30 días
        });                    
    res.status(200).json({ message: 'Cookie set successfully' });
} catch (error) {
    console.error('Error setting cookie:', error);
    res.status(500).json({ message: 'Error setting cookie' });
}};