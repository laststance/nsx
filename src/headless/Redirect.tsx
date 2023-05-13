import { memo } from 'react'
import type { To } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

import { useIsomorphicLayoutEffect } from '../hooks/useIsomorphicLayoutEffect'

interface Props {
  to: To
}

const Redirect: React.FC<Props> = memo(
  ({ to }) => {
    const navigate = useNavigate()
    useIsomorphicLayoutEffect(() => {
      navigate(to)
    }, [])
    return null
  },
  () => true
)
Redirect.displayName = 'Headless.Redirect'

export default Redirect
