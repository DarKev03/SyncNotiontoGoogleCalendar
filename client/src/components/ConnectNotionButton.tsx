import React from 'react';

const ConnectNotionButton: React.FC = () => {
  const handleClick = () => {
    window.location.href = 'http://localhost:5050/auth/notion';
  };

  return (
    <button onClick={handleClick} style={{ padding: '10px 20px', fontSize: '16px' }}>
      Conectar cuentas
    </button>
  );
};

export default ConnectNotionButton;
