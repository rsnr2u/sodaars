import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import AppRoutes from './routes/AppRoutes';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AppRoutes />
    </BrowserRouter>
  );
};

export default App;
