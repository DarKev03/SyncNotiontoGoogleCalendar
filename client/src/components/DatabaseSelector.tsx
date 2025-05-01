import { useState } from 'react';
import axios from 'axios';
import { hover } from '@testing-library/user-event/dist/hover';

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
                    setError('Debes conectar tus cuentas primero.');
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
            <h3>Listar bases de datos</h3>            
            <button onClick={handleListDatabases} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="black"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <polyline points="6 9 12 15 18 9" />
                </svg>

            </button>

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
