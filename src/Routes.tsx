import React from 'react'
import { Router } from '@reach/router'
import App from './pages/App'
import PostPage from './pages/PostPage'
import Login from './pages/Login'
import Dashbord from './pages/Dashbord'

const Routes: React.FC = () => (
  <Router>
    <App path="/" />
    <PostPage path="post/:postId" />
    <Login path="login" />
    <Dashbord path="dashbord" />
  </Router>
)

export default Routes
