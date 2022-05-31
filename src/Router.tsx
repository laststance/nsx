import React, { memo } from 'react'
import { Routes, Route } from 'react-router-dom'

import { useIsomorphicLayoutEffect } from './hooks/useIsomorphicLayoutEffect'
import OffScreen from './offscreen/index'
import About from './pages/About/index'
import Create from './pages/Dashboard/Create/index'
import Edit from './pages/Dashboard/Edit/index'
import Dashboard from './pages/Dashboard/index'
import Index from './pages/Index/index'
import Login from './pages/Login/index'
import NotFound from './pages/NotFound/index'
import Post from './pages/Post/index'
import { useAppSelector } from './redux/hooks'
import { dispatch } from './redux/store'
import { updateTheme, selectTheme } from './redux/themeSlice'

const Router = memo(() => {
  // apply TailwindCSS theme onLoaded
  // bause Router component render phase defenitelly run once per app loding
  const theme = useAppSelector(selectTheme)
  useIsomorphicLayoutEffect(() => {
    dispatch(updateTheme(theme))
  }, [])

  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="post/:postId" element={<Post />} />
      <Route path="about" element={<About />} />
      <Route path="login" element={<Login />} />
      <Route path="dashboard" element={<OffScreen.Permission />}>
        <Route index element={<Dashboard />} />
        <Route path="create" element={<Create />} />
        <Route path="edit/:postId" element={<Edit />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
})
Router.displayName = 'Router'

export default Router
