import { TonConnectButton, useTonWallet } from '@tonconnect/ui-react';
import { Text } from '@telegram-apps/telegram-ui';
import { FC } from 'react';
import { Page } from '@/components/Page.tsx';
import BottomNavigation from '@/components/TradingGame/BottomNavigation';
import './WalletPage.css';

export const WalletPage: FC = () => {
  const wallet = useTonWallet();

  return (
    <Page>
      <div className="wallet-page__container">
        {!wallet ? (
          <div className="wallet-page__connect-card">
            <TonConnectButton className="wallet-page__button"/>
            <Text className="wallet-page__hint">
              Подключите кошелек для торговли
            </Text>
          </div>
        ) : (
          <div className="wallet-page__connect-card">
            <TonConnectButton className="wallet-page__button"/>
          </div>
        )}
      </div>
      <BottomNavigation />
    </Page>
  );
};