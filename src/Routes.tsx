import React from 'react'
import { Router } from '@reach/router'
import TopPage from './pages/TopPage'
import PostPage from './pages/PostPage'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import NotFound from './pages/NotFound'

const Routes: React.FC = () => (
  <Router>
    <TopPage path="/" />
    <PostPage path="post/:postId" />
    <Login path="login" />
    <Signup path="signup" />
    <Dashboard path="dashboard" />
    <NotFound default />
  </Router>
)

export default Routes
