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
              Connect your wallet to trade
            </Text>
          </div>
        ) : (
          <div className="wallet-page__connect-card">
            <TonConnectButton className="wallet-page__button"/>
          </div>
        )}
        {/* Removed AeonConnect component */}
        {/* <AeonConnect onConnect={handleAeonConnect} /> */}
      </div>
      <BottomNavigation />
    </Page>
  );
};