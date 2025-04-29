import React from 'react';
import ConnectNotionButton from '../components/ConnectNotionButton';
import DatabaseSelector from '../components/DatabaseSelector';

const Home: React.FC = () => {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f9fafb',
      fontFamily: 'Inter, sans-serif',
      padding: '2rem',
      textAlign: 'center'
    }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#111827' }}>
        🔗 Sync Notion to Google Calendar
      </h1>
      <p style={{ fontSize: '1.25rem', marginBottom: '2rem', color: '#6b7280' }}>
        Conecta tu cuenta para empezar a sincronizar tus tareas.
      </p>
      <ConnectNotionButton />
      <DatabaseSelector />
    </div>
  );
};

export default Home;
