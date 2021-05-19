import React from 'react'
import { Router } from '@reach/router'
import TopPage from './pages/TopPage'
import PostPage from './pages/PostPage'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import Admin from './components/Admin'
import NotFound from './pages/NotFound'

const Routes: React.FC = () => (
  <Router>
    <TopPage path="/" />
    <PostPage path="post/:postId" />
    <Login path="login" />
    <Signup path="signup" />
    <Admin path="admin">
      <Dashboard path="dashboard" />
      <NotFound default />
    </Admin>
    <NotFound default />
  </Router>
)

export default Routes
