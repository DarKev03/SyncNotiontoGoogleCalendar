import React from 'react';

const ConnectNotionButton: React.FC = () => {
  const handleClick = () => {
    window.open('https://syncnotiontogooglecalendar.onrender.com/auth/notion', '_blank');
  };

  return (
    <button onClick={handleClick} style={{ padding: '10px 20px', fontSize: '16px' }}>
      Conectar cuentas
    </button>
  );
};

export default ConnectNotionButton;
