import { memo } from 'react'
import { useNavigate } from 'react-router-dom'

import { useIsomorphicLayoutEffect } from '../hooks/useIsomorphicLayoutEffect'

const Redirect: React.FC<React.PropsWithChildren<{ to: string }>> = memo(
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
