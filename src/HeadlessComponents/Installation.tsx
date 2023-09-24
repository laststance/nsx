import React, { memo } from 'react'

import Loading from '../components/Loading/Loading'
import Signup from '../pages/Signup'
import { useGetUserCountQuery } from '../redux/API'

// @TODO refactor into a Sidebar
const Installation: React.FC = memo(() => {
  const { data, error, isLoading } = useGetUserCountQuery()

  if (isLoading) return <Loading />
  if (error) return <div>Error</div>
  if (data && data.userCount === 0) return <Signup />

  return <div>There is no post.</div>
})
Installation.displayName = 'Installation'

export default Installation
