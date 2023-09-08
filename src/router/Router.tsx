import React, { memo } from 'react'
import { Routes, Route } from 'react-router-dom'

import About from '../pages/About'
import Dashboard from '../pages/Dashboard'
import Create from '../pages/Dashboard/Create'
import Edit from '../pages/Dashboard/Edit'
import Setting from '../pages/Dashboard/Setting'
import Index from '../pages/Index'
import Login from '../pages/Login'
import NotFound from '../pages/NotFound'
import Post from '../pages/Post'

import AuthRouter from './AuthRouter'

const Router = memo(
  () => (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="post/:postId_querystring" element={<Post />} />
      <Route path="about" element={<About />} />
      <Route path="login" element={<Login />} />
      <Route path="dashboard" element={<AuthRouter />}>
        <Route index element={<Dashboard />} />
        <Route path="create" element={<Create />} />
        <Route path="edit/:postId" element={<Edit />} />
        <Route path="setting/*" element={<Setting />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  ),

  () => true,
)
Router.displayName = 'Router'

export default Router
