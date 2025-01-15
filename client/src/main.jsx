import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from '@/App.jsx'
import { WordListProvider } from "@/contexts/WordListContext"
import './index.css'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <WordListProvider>
      <App />
    </WordListProvider>
  </StrictMode>
)
