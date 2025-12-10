import { ThemeProvider } from './context/ThemeContext'
import Portfolio from './components/Portfolio'

function App() {
  return (
    <ThemeProvider>
      <Portfolio />
    </ThemeProvider>
  )
}

export default App
