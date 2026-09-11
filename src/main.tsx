import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { EntriesProvider } from './store/EntriesProvider';
import { ToastProvider } from './components/ui/Toast';
import './styles/globals.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ToastProvider>
      <EntriesProvider>
        <App />
      </EntriesProvider>
    </ToastProvider>
  </StrictMode>,
);
