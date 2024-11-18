// src/components/AeonConnect.tsx
import { useState } from 'react';
import { Button } from '@telegram-apps/telegram-ui';

interface AeonConnectProps {
  onConnect?: () => void;
}

export const AeonConnect: React.FC<AeonConnectProps> = ({ onConnect }) => {
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    try {
      setIsConnecting(true);
      
      // Here will be the logic for connecting to Aeon
      const tgInitData = window.Telegram.WebApp.initData;
      
      if (!tgInitData) {
        throw new Error("Telegram authentication Error!");
      }

      // Call the callback if it is provided
      if (onConnect) {
        onConnect();
      }

    } catch (error) {
      console.error('Aeon connection error:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <Button
      onClick={handleConnect}
      loading={isConnecting}
    >
      Connect with Aeon
    </Button>
  );
};