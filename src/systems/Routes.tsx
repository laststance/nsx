import React from 'react'
import { Router } from '@reach/router'
import Index from '../pages/index'
import Post from '../pages/Post'
import Login from '../pages/Login'
import Signup from '../pages/Signup'
import Dashboard from '../pages/Dashboard'
import NotFound from '../pages/NotFound'
import Create from '../pages/Create'
import Edit from '../pages/Edit'
import AuthBoundary from './AuthBoundary'
import About from '../pages/About'

const Routes: React.FC = () => (
  <Router>
    <Index path="/" />
    <Post path="post/:postId" />
    <About path="/about" />
    {process.env.REACT_APP_ENABLE_SIGNUP && <Signup path="signup" />}
    {process.env.REACT_APP_ENABLE_LOGIN && <Login path="login" />}
    <AuthBoundary path="dashboard">
      <Dashboard path="/" />
      <Create path="create" />
      <Edit path="edit/:postId" />
    </AuthBoundary>
    <NotFound default />
  </Router>
)

export default React.memo(Routes)
