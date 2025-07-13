import { GlobalContextProvider } from '@/global_context';
import '@/index.css';
import ActivitiesPage from '@/posts/activities';
import PostEditPage from '@/posts/post_edit';
import PostsPage from '@/posts/posts';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Toaster } from "react-hot-toast";
import { BrowserRouter, Route, Routes } from 'react-router-dom';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <GlobalContextProvider>
        <Routes>
          <Route path="/" element={<PostsPage />} />
          <Route path="/posts" element={<PostsPage />} />
          <Route path="/posts/:postId" element={<PostsPage />} />
          <Route path="/posts/new" element={<PostEditPage />} />
          <Route path="/posts/edit/:postId" element={<PostEditPage />} />
          <Route path="/activities" element={<ActivitiesPage />} />
        </Routes>
      </GlobalContextProvider>
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
