import React from 'react'
import { Router } from '@reach/router'
import TopPage from './pages/TopPage'
import PostPage from './pages/PostPage'
import Login from './pages/Login'
import Dashbord from './pages/Dashbord'
import Admin from './components/Admin'

const Routes: React.FC = () => (
  <Router>
    <TopPage path="/" />
    <PostPage path="post/:postId" />
    <Login path="login" />
    <Admin path="admin">
      <Dashbord path="dashbord" />
    </Admin>
  </Router>
)

export default Routes
