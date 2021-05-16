import React from 'react'
import { Router } from '@reach/router'
import TopPage from './pages/TopPage'
import PostPage from './pages/PostPage'
import Login from './pages/Login'
import Dashbord from './pages/Dashbord'

const Routes: React.FC = () => (
  <Router>
    <TopPage path="/" />
    <PostPage path="post/:postId" />
    <Login path="login" />
    <Dashbord path="dashbord" />
  </Router>
)

export default Routes
