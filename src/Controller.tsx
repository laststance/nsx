import React, { lazy, memo, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Loading from './elements/Loading'
import About from './pages/About'
import Index from './pages/Index'
import Post from './pages/Post'

const Login = lazy(() => import('./pages/Login'))
const Signup = lazy(() => import('./pages/Signup'))
const Private = lazy(() => import('./systems/Private'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const NotFound = lazy(() => import('./pages/NotFound'))
const Create = lazy(() => import('./pages/Create'))
const Edit = lazy(() => import('./pages/Edit'))

const Controller = memo(() => (
  <Suspense fallback={<Loading />}>
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
  </Suspense>
))
Controller.displayName = 'Controller'

export default Controller
