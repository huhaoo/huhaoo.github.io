import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@/index.css'
import { Toaster } from "react-hot-toast";
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ActivitiesPage from '@/posts/activities';
import PostsPage from './posts/posts';
import PostEditPage from './posts/post_edit';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>

      <Routes>
        <Route path="/" element={<PostsPage />} />
        <Route path="/posts" element={<PostsPage />} />
        <Route path="/posts/:postId" element={<PostsPage />} />
        <Route path="/posts/new" element={<PostEditPage />} />
        <Route path="/posts/edit/:postId" element={<PostEditPage />} />
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
