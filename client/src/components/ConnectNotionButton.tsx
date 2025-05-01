import React from 'react';

const ConnectNotionButton: React.FC = () => {
  const handleClick = () => {    
    window.open(`${process.env.REACT_APP_NOTION_AUTH}`, '_self');
  };

  return (
    <button onClick={handleClick} style={{ padding: '10px 20px', fontSize: '16px' }}>
      Conectar cuentas
    </button>
  );
};

export default ConnectNotionButton;
