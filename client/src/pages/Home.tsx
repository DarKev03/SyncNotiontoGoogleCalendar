import React from 'react';
import ConnectNotionButton from '../components/ConnectNotionButton';

const Home: React.FC = () => {
  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h1>🔗 Sync Notion to Google Calendar</h1>
      <p>Conecta tu cuenta de Notion para empezar a sincronizar tus tareas.</p>
      <ConnectNotionButton />
    </div>
  );
};

export default Home;
