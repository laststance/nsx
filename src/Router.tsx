import React, { memo } from 'react'
import { Routes, Route } from 'react-router-dom'

import { useIsomorphicLayoutEffect } from './hooks/useIsomorphicLayoutEffect'
import Permission from './offscreen/Permission'
import About from './pages/About/index'
import Dashboard from './pages/Dashboard'
import Create from './pages/Dashboard/Create'
import Edit from './pages/Dashboard/Edit'
import Setting from './pages/Dashboard/Setting'
import Index from './pages/Index'
import Login from './pages/Login'
import NotFound from './pages/NotFound'
import Post from './pages/Post'
import { useAppSelector } from './redux/hooks'
import { dispatch } from './redux/store'
import { updateTheme, selectTheme } from './redux/themeSlice'

const Router = memo(
  () => {
    // apply TailwindCSS theme onLoaded
    // bause Router component render phase defenitelly run once per app loding
    const theme = useAppSelector(selectTheme)
    useIsomorphicLayoutEffect(() => {
      dispatch(updateTheme(theme))
    }, [])

    return (
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="post/:postId_querystring" element={<Post />} />
        <Route path="about" element={<About />} />
        <Route path="login" element={<Login />} />
        <Route path="dashboard" element={<Permission />}>
          <Route index element={<Dashboard />} />
          <Route path="create" element={<Create />} />
          <Route path="edit/:postId" element={<Edit />} />
          <Route path="setting/*" element={<Setting />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    )
  },
  () => true
)
Router.displayName = 'Router'

export default Router
