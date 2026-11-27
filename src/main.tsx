import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { MotionConfig } from 'framer-motion';
import '@fontsource-variable/fraunces';
import '@fontsource-variable/manrope';
import 'leaflet/dist/leaflet.css';
import './styles.css';
import App from './App';
import { ProgressProvider } from './lib/progress';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MotionConfig reducedMotion="user">
      <ProgressProvider>
        <App />
      </ProgressProvider>
    </MotionConfig>
  </StrictMode>,
);
