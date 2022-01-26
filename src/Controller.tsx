import React, { lazy, memo } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import About from './pages/About'
import Create from './pages/Create'
import Index from './pages/Index'
import Post from './pages/Post'
import Private from './systems/Private'

const Login = lazy(() => import('./pages/Login'))
const Signup = lazy(() => import('./pages/Signup'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const NotFound = lazy(() => import('./pages/NotFound'))

const Edit = lazy(() => import('./pages/Edit'))

const Controller = memo(() => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="post/:postId" element={<Post />} />
      <Route path="about" element={<About />} />
      {import.meta.env['VITE_ENABLE_SIGNUP'] === 'true' && (
        <Route path="signup" element={<Signup />} />
      )}
      {import.meta.env['VITE_ENABLE_LOGIN'] === 'true' && (
        <Route path="login" element={<Login />} />
      )}
      <Route path="dashboard" element={<Private />}>
        <Route index element={<Dashboard />} />
        <Route path="create" element={<Create />} />
        <Route path="edit/:postId" element={<Edit />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
))
Controller.displayName = 'Controller'

export default Controller
