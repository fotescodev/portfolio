import { ThemeProvider } from './context/ThemeContext'
import { HelmetProvider } from 'react-helmet-async';
import Portfolio from './components/Portfolio'

function App() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <Portfolio />
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App
