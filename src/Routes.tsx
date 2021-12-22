import { Router } from '@reach/router'
import React, { lazy, memo, Suspense } from 'react'

import Loading from './elements/Loading'
import About from './pages/About'
import Index from './pages/Index'
import Post from './pages/Post'

const Login = lazy(() => import('./pages/Login'))
const Signup = lazy(() => import('./pages/Signup'))
const AdminRoutes = lazy(() => import('./systems/AdminRoutes'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const NotFound = lazy(() => import('./pages/NotFound'))
const Create = lazy(() => import('./pages/Create'))
const Edit = lazy(() => import('./pages/Edit'))

const Routes = memo(() => (
  <Suspense fallback={<Loading />}>
    <Router>
      <Index path="/" />
      <Post path="post/:postId" />
      <About path="/about" />
      {import.meta.env['VITE_ENABLE_SIGNUP'] === 'true' && (
        <Signup path="signup" />
      )}
      {import.meta.env['VITE_ENABLE_LOGIN'] === 'true' && (
        <Login path="login" />
      )}
      <AdminRoutes path="dashboard">
        <Dashboard path="/" />
        <Create path="create" />
        <Edit path="edit/:postId" />
      </AdminRoutes>
      <NotFound default />
    </Router>
  </Suspense>
))
Routes.displayName = 'Routes'

export default Routes
