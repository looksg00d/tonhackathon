import { openLink } from '@telegram-apps/sdk-react';
import { TonConnectButton, useTonWallet } from '@tonconnect/ui-react';
import {
  Avatar,
  Cell,
  List,
  Navigation,
  Placeholder,
  Section,
  Text,
  Title,
} from '@telegram-apps/telegram-ui';
import { FC } from 'react';
import { Page } from '@/components/Page.tsx';
import BottomNavigation from '@/components/TradingGame/BottomNavigation';
import './WalletPage.css';

export const WalletPage: FC = () => {
  const wallet = useTonWallet();

  if (!wallet) {
    return (
      <Page>
        <Placeholder
          className="wallet-page__placeholder"
          header="Подключите кошелек"
          description={
            <>
              <Text>
                Для торговли необходимо подключить TON кошелек
              </Text>
              <TonConnectButton className="wallet-page__button"/>
            </>
          }
        />
        <BottomNavigation />
      </Page>
    );
  }

  const {
    account: { chain, address },
  } = wallet;

  return (
    <Page>
      <List>
        {'imageUrl' in wallet && (
          <Section>
            <Cell
              before={
                <Avatar 
                  src={wallet.imageUrl} 
                  alt="Wallet logo" 
                  width={60} 
                  height={60}
                />
              }
              after={<Navigation>About wallet</Navigation>}
              subtitle={wallet.appName}
              onClick={(e) => {
                e.preventDefault();
                openLink(wallet.aboutUrl);
              }}
            >
              <Title level="3">{wallet.name}</Title>
            </Cell>
          </Section>
        )}
        <Section>
          <Cell>
            <Text>Адрес: {address}</Text>
            <Text>Сеть: {chain}</Text>
          </Cell>
        </Section>
        <TonConnectButton className="wallet-page__button-connected"/>
      </List>
      <BottomNavigation />
    </Page>
  );
};