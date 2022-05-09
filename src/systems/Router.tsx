import React, { memo } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import About from '../pages/About/index'
import Create from '../pages/Create/index'
import Dashboard from '../pages/Dashboard/index'
import Edit from '../pages/Edit/index'
import Index from '../pages/Index/index'
import Login from '../pages/Login/index'
import NotFound from '../pages/NotFound/index'
import Post from '../pages/Post/index'
import Signup from '../pages/Signup/index'

import Private from './Private'

const Router = memo(() => (
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
Router.displayName = 'Router'

export default Router
