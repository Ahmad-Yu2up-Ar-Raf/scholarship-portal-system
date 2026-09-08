import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ThemeProvider } from "next-themes"
import { HelmetProvider } from "react-helmet-async"
import { Toaster } from "@/components/ui/sonner"
import "@fontsource/archivo-black"
import "@fontsource/space-grotesk"
import './index.css'
import App from './App.tsx'

const qc = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
        <QueryClientProvider client={qc}>
          <App />
          <Toaster richColors position="top-center" />
        </QueryClientProvider>
      </ThemeProvider>
    </HelmetProvider>
  </StrictMode>,
)
