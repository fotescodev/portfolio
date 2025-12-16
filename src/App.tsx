import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { HelmetProvider } from 'react-helmet-async';
import BasePortfolio from './pages/BasePortfolio';
import VariantPortfolio from './pages/VariantPortfolio';

function App() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <BrowserRouter>
          <Routes>
            {/* Base portfolio route */}
            <Route path="/" element={<BasePortfolio />} />

            {/* Variant portfolio routes: /company/role */}
            <Route path="/:company/:role" element={<VariantPortfolio />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;
