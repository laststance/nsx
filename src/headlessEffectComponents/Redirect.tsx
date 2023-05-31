import type { HeadlessEffectComponent } from 'react'
import { memo } from 'react'
import type { To } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

import { useIsomorphicLayoutEffect } from '../hooks/useIsomorphicLayoutEffect'

interface Props {
  to: To
}

const Redirect: HeadlessEffectComponent<Props> = memo<Props>(
  ({ to }) => {
    const navigate = useNavigate()
    useIsomorphicLayoutEffect(() => {
      navigate(to)
    }, [])
    return null
  },
  () => true
)
Redirect.displayName = 'HeadlessEffect.Redirect'

export default Redirect
