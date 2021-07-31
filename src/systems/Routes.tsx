import React, { Suspense, lazy, memo } from 'react'
import { Router } from '@reach/router'
import Index from '../pages/index'
import Post from '../pages/Post'
import About from '../pages/About'
import { Loading } from '../elements/Loading'

const Login = lazy(
  () => import('../pages/Login') /* webpackChunkName: "LoginPage" */
)
const Signup = lazy(
  () => import('../pages/Signup') /* webpackChunkName: "SignupPage" */
)
const AdminRoutes = lazy(
  () => import('./AdminRoutes') /* webpackChunkName: "AdminRoutes" */
)
const Dashboard = lazy(
  () => import('../pages/Dashboard') /* webpackChunkName: "DashboardPage" */
)
const NotFound = lazy(
  () => import('../pages/NotFound') /* webpackChunkName: "NotFound" */
)
const Create = lazy(
  () => import('../pages/Create') /* webpackChunkName: "CreatePage" */
)
const Edit = lazy(
  () => import('../pages/Edit') /* webpackChunkName: "EditPage" */
)

const Routes = memo(() => (
  <Suspense fallback={<Loading />}>
    <Router>
      <Index path="/" />
      <Post path="post/:postId" />
      <About path="/about" />
      {process.env.REACT_APP_ENABLE_SIGNUP && <Signup path="signup" />}
      {process.env.REACT_APP_ENABLE_LOGIN && <Login path="login" />}
      <AdminRoutes path="dashboard">
        <Dashboard path="/" />
        <Create path="create" />
        <Edit path="edit/:postId" />
      </AdminRoutes>
      <NotFound default />
    </Router>
  </Suspense>
))

export default Routes
