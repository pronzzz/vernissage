import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { PaletteProvider } from '@/state/palette';
import { UIProvider } from '@/state/ui';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PaletteProvider>
      <UIProvider>
        <App />
      </UIProvider>
    </PaletteProvider>
  </StrictMode>,
);
