import React, { memo } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import About from './pages/About'
import Create from './pages/Create'
import Dashboard from './pages/Dashboard'
import Edit from './pages/Edit'
import Index from './pages/Index'
import Login from './pages/Login'
import NotFound from './pages/NotFound'
import Post from './pages/Post'
import Signup from './pages/Signup'
import Private from './systems/Private'

const Controller = memo(() => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="post/:postId" element={<Post />} />
      <Route path="about" element={<About />} />
      {process.env.VITE_ENABLE_SIGNUP === 'true' && (
        <Route path="signup" element={<Signup />} />
      )}
      {process.env.VITE_ENABLE_LOGIN === 'true' && (
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
