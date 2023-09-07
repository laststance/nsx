import React, { memo, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'

import Index from '../pages/Index'
import Post from '../pages/Post'

import AuthRouter from './AuthRouter'

const Dashboard = lazy(async () => import('../pages/Dashboard'))
const Create = lazy(async () => import('../pages/Dashboard/Create'))
const Edit = lazy(async () => import('../pages/Dashboard/Edit'))
const Setting = lazy(async () => import('../pages/Dashboard/Setting'))
const Login = lazy(async () => import('../pages/Login'))
const NotFound = lazy(async () => import('../pages/NotFound'))
const About = lazy(async () => import('../pages/About'))

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
