import React from 'react'
import { Router } from '@reach/router'
import TopPage from './pages/TopPage'
import PostPage from './pages/PostPage'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import NotFound from './pages/NotFound'
import Create from './pages/Create'
import Edit from './pages/Edit'
import LoginArea from './systems/LoginArea'

const Routes: React.FC = () => (
  <Router>
    <TopPage path="/" />
    <PostPage path="post/:postId" />
    {process.env.REACT_APP_ENABLE_SIGNUP && <Signup path="signup" />}
    <Login path="login" />
    <LoginArea path="dashboard">
      <Dashboard path="/" />
      <Create path="create" />
      <Edit path="edit/:postId" />
    </LoginArea>
    <NotFound default />
  </Router>
)

export default React.memo(Routes)
