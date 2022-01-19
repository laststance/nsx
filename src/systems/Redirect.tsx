import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const Redirect: React.FC<{ to: string }> = ({ to }) => {
  const navigate = useNavigate()
  useEffect(() => {
    navigate(to)
  })
  return null
}

export default Redirect
