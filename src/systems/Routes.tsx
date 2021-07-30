import React, { Profiler } from 'react'
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

let queue: {
  id: any
  phase: any
  actualDuration: any
  baseDuration: any
  startTime: any
  commitTime: any
  interactions: any
}[] = []
// sendProfileQueue every 5 seconds
setInterval(sendProfileQueue, 5000)
function onRenderCallback(
  id: any,
  phase: any,
  actualDuration: any,
  baseDuration: any,
  startTime: any,
  commitTime: any,
  interactions: any
) {
  queue.push({
    id,
    phase,
    actualDuration,
    baseDuration,
    startTime,
    commitTime,
    interactions,
  })
}
function sendProfileQueue() {
  if (!queue.length) {
    return Promise.resolve()
  }
  const queueToSend = [...queue]
  queue = []
  // here's where we'd actually make the server call to send the queueToSend
  // data to our backend...
  console.info('sending profile queue', queueToSend)
  return Promise.resolve()
}

const Routes: React.FC = () => (
  <Router>
    <Profiler id="Top" onRender={onRenderCallback}>
      <Index path="/" />
    </Profiler>
    <Profiler id="Post" onRender={onRenderCallback}>
      <Post path="post/:postId" />
    </Profiler>
    <About path="/about" />
    {process.env.REACT_APP_ENABLE_SIGNUP && <Signup path="signup" />}
    {process.env.REACT_APP_ENABLE_LOGIN && <Login path="login" />}
    <AuthBoundary path="dashboard">
      <Profiler id="Dashboard" onRender={onRenderCallback}>
        <Dashboard path="/" />
      </Profiler>
      <Profiler id="Create" onRender={onRenderCallback}>
        <Create path="create" />
      </Profiler>
      <Profiler id="Edit" onRender={onRenderCallback}>
        <Edit path="edit/:postId" />
      </Profiler>
    </AuthBoundary>
    <NotFound default />
  </Router>
)

export default React.memo(Routes)
