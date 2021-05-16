import React from 'react'
import { Router } from '@reach/router'
import App from './App'
import PostPage from './PostPage'
import Login from './Login'
import Dashbord from './Dashbord'

const Routes: React.FC = () => (
  <Router>
    <App path="/" />
    <PostPage path="post/:postId" />
    <Login path="login" />
    <Dashbord path="dashbord" />
  </Router>
)

export default Routes
