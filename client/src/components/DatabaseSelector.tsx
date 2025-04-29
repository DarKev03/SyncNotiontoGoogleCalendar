import { useState, useEffect } from 'react';
import axios from 'axios';

interface NotionDatabase {
    id: string;
    title: Array<{ plain_text: string }>;
}

export default function DatabaseList() {
    const [databases, setDatabases] = useState<NotionDatabase[]>([]);

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_NOTION_DATABASES}`, { withCredentials: true })
            .then(res => setDatabases(res.data))
            .catch(err => console.error('Error al cargar bases de datos:', err));
    }, []);

    return (
        <div>
            <h2>Bases de datos de Notion:</h2>
            <ul>
                {databases.map(db => {
                    const title = db.title[0]?.plain_text || 'Sin título';
                    return (
                        <li key={db.id}>
                            {title}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
