import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { BlogList } from '../components/blog/BlogList';
import { BlogPost } from '../components/blog/BlogPost';

export function Blog() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Routes>
          <Route index element={<BlogList />} />
          <Route path=":slug" element={<BlogPost />} />
        </Routes>
      </div>
    </div>
  );
}
