import { useState } from 'react';
import axios from 'axios';

interface NotionDatabase {
    id: string;
    title: Array<{ plain_text: string }>;
}

const getCookie = (name: string): string | null => {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
        const [key, value] = cookie.trim().split('=');
        if (key === name) return decodeURIComponent(value);
    }
    return null;
};

export default function DatabaseList() {
    const [databases, setDatabases] = useState<NotionDatabase[]>([]);
    const [error, setError] = useState<string | null>(null);

    const handleListDatabases = async () => {
        try {
            const cookieToken = getCookie('user_token');

            if (!cookieToken) {
                const params = new URLSearchParams(window.location.search);
                const notionUserId = params.get('notion_user_id');

                if (!notionUserId) {
                    setError('No hay cookie ni ID de usuario disponible.');
                    return;
                }

                await axios.get(`https://syncnotiontogooglecalendar.onrender.com/auth/cookie?notion_user_id=${notionUserId}`, {
                    withCredentials: true
                });
                console.log('✅ Cookie seteada');
            }

            const res = await axios.get(`${process.env.REACT_APP_NOTION_DATABASES}`, {
                withCredentials: true
            });

            setDatabases(res.data);
            setError(null);
        } catch (err) {
            console.error('❌ Error al cargar bases de datos:', err);
            setError('No se pudieron cargar las bases de datos.');
        }
    };

    return (
        <div>
            <h2>📚 Bases de datos de Notion:</h2>
            <button onClick={handleListDatabases}>Mostrar bases de datos</button>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            <ul>
                {databases.map(db => {
                    const title = db.title[0]?.plain_text || 'Sin título';
                    return <li key={db.id}>{title}</li>;
                })}
            </ul>
        </div>
    );
}
