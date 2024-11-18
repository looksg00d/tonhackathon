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
      
      // Здесь будет логика подключения к Aeon
      const tgInitData = window.Telegram.WebApp.initData;
      
      if (!tgInitData) {
        throw new Error("Telegram authentication Error!");
      }

      // Вызываем callback если он передан
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