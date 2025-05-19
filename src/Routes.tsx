import React, { memo } from 'react'
import { Routes as ReactRouterRoutes, Route } from 'react-router'

import { Tweet } from '@/src/pages/Dashboard/Tweet'

import About from './pages/About'
import Dashboard from './pages/Dashboard'
import Create from './pages/Dashboard/Create'
import Edit from './pages/Dashboard/Edit'
import Setting from './pages/Dashboard/Setting'
import Index from './pages/Index'
import Login from './pages/Login'
import NotFound from './pages/NotFound'
import Post from './pages/Post'
import AuthRouter from './router/AuthRouter'

const Routes = memo(
  () => (
    <ReactRouterRoutes>
      <Route path="/" element={<Index />} />
      <Route path="post/:postId_querystring" element={<Post />} />
      <Route path="about" element={<About />} />
      <Route path="login" element={<Login />} />
      <Route path="dashboard" element={<AuthRouter />}>
        <Route index element={<Dashboard />} />
        <Route path="create" element={<Create />} />
        <Route path="edit/:postId" element={<Edit />} />
        <Route path="tweet" element={<Tweet />} />
        <Route path="setting/*" element={<Setting />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </ReactRouterRoutes>
  ),

  () => true,
)
Routes.displayName = 'Routes'

export default Routes
