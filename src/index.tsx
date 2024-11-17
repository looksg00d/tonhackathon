import React from 'react';
import ReactDOM from 'react-dom/client';
import { StrictMode } from 'react';
import { retrieveLaunchParams } from '@telegram-apps/sdk-react';
import { HashRouter } from 'react-router-dom';

import { Root } from '@/components/Root.tsx';
import { EnvUnsupported } from '@/components/EnvUnsupported.tsx';
import { init } from '@/init.ts';

import '@telegram-apps/telegram-ui/dist/styles.css';
import './index.css';

// Mock the environment in case, we are outside Telegram.
import './mockEnv.ts';

// Добавляем объявление типов для Telegram WebApp
declare global {
    interface Window {
        Telegram: {
            WebApp: any;
        };
    }
}

const root = ReactDOM.createRoot(document.getElementById('root')!);

try {
    // Configure all application dependencies.
    init(retrieveLaunchParams().startParam === 'debug' || import.meta.env.DEV);

    root.render(
        <StrictMode>
            <HashRouter>
                <Root />
            </HashRouter>
        </StrictMode>
    );
} catch (e) {
    root.render(<EnvUnsupported />);
}
