import { memo } from 'react'
import type { To } from 'react-router'
import { useNavigate } from 'react-router'

import { useIsomorphicEffect } from '../hooks/useIsomorphicEffect'

interface Props {
  to: To
}

const Redirect = memo<Props>(({ to }) => {
  const navigate = useNavigate()
  useIsomorphicEffect(() => {
    navigate(to)
  }, [navigate, to])
  return null
})
Redirect.displayName = 'Redirect'

export default Redirect
