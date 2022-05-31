import React, { memo } from 'react'
import { Routes, Route } from 'react-router-dom'

import { useIsomorphicLayoutEffect } from '../hooks/useIsomorphicLayoutEffect'
import OffScreen from '../offscreen/index'
import { useAppSelector } from '../redux/hooks'
import { dispatch } from '../redux/store'
import { updateTheme, selectTheme } from '../redux/themeSlice'

import About from './About/index'
import Create from './Create/index'
import Dashboard from './Dashboard/index'
import Edit from './Edit/index'
import Index from './Index/index'
import Login from './Login/index'
import NotFound from './NotFound/index'
import Post from './Post/index'

const Router = memo(() => {
  // apply TailwindCSS theme onLoaded
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
