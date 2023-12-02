import { memo } from 'react'
import type { To } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

import { useIsomorphicEffect } from '../hooks/useIsomorphicEffect'

interface Props {
  to: To
}

const Redirect = memo<Props>(
  ({ to }) => {
    const navigate = useNavigate()
    useIsomorphicEffect(() => {
      navigate(to)
    }, [])
    return null
  },
  () => true,
)
Redirect.displayName = 'Redirect'

export default Redirect
