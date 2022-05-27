import { useEffect, memo } from 'react'
import { useNavigate } from 'react-router-dom'

const Redirect: React.FC<React.PropsWithChildren<{ to: string }>> = memo(
  ({ to }) => {
    const navigate = useNavigate()
    useEffect(() => {
      navigate(to)
    }, [])
    return null
  },
  () => true
)
Redirect.displayName = 'Offscreen.Redirect'

export default Redirect
