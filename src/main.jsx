import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
// PUDHUSA ADD PANNATHU: Context-a import panrom
import { CartProvider } from './context/CartContext.jsx' 

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CartProvider> {/* PUDHUSA ADD PANNATHU: App-a wrap panrom */}
      <App />
    </CartProvider>
  </StrictMode>,
)