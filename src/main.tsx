import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@/index.css'
import IndexPage from '@/index'
import { Toaster } from "react-hot-toast";
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ActivitiesPage from '@/posts/activities';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>

      <Routes>
        <Route path="/" element={<IndexPage />} />
        <Route path="/posts" element={<IndexPage />} />
        <Route path="/activities" element={<ActivitiesPage />} />
      </Routes>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          className: 'text-sm',
        }}
      />
    </BrowserRouter>
  </StrictMode>,
)
