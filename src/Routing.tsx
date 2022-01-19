import React, { lazy, memo, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Loading from './elements/Loading'
import About from './pages/About'
import Index from './pages/Index'
import Post from './pages/Post'

const Login = lazy(() => import('./pages/Login'))
const Signup = lazy(() => import('./pages/Signup'))
// const AdminRoutes = lazy(() => import('./systems/AdminRoutes'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const NotFound = lazy(() => import('./pages/NotFound'))
const Create = lazy(() => import('./pages/Create'))
const Edit = lazy(() => import('./pages/Edit'))

const Routing = memo(() => (
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
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="dashboard/create" element={<Create />} />
        <Route path="dashboard/edit/:postId" element={<Edit />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </Suspense>
))
Routing.displayName = 'Routes'

export default Routing
