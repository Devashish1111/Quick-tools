import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router'
import './index.css'
import App from './App.tsx'
import Home from './pages/Home.tsx'

// Placeholder components for new routes
const ComingSoon = ({ title }: { title: string }) => (
  <div className="min-h-screen flex items-center justify-center" style={{ background: '#09090E', color: 'var(--qt-text)' }}>
    <div className="text-center">
      <h1 className="text-4xl font-black font-display mb-4">{title}</h1>
      <p className="text-sm text-gray-400 mb-8">This page is under construction.</p>
      <a href="/" className="qt-btn px-6 py-3">Back to Home</a>
    </div>
  </div>
);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/app" element={<Navigate to="/tools/url-shortener" replace />} />
        <Route path="/tools/:toolId" element={<App />} />
        <Route path="/blog" element={<ComingSoon title="Blog" />} />
        <Route path="/blog/:slug" element={<ComingSoon title="Blog Article" />} />
        <Route path="/premium" element={<ComingSoon title="Premium" />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
