import React, { memo } from 'react'
import { Link } from 'react-router-dom'

import Button from '../../components/Button/Button'
import { handleLogout } from '../../offscreen/Sidebar/LogoutLink'
import type { AdminState } from '../../redux/adminSlice'
import { selectLogin } from '../../redux/adminSlice'
import { useAppSelector } from '../../redux/hooks'

const DashboardButtonGroup: React.FC = memo(() => {
  const login: AdminState['login'] = useAppSelector(selectLogin)
  if (login === false) return null

  return (
    <div className="flex items-center justify-around py-10">
      <Link to="/dashboard">
        <Button variant="primary" data-cy="dashboard-page-link">
          Dashboard
        </Button>
      </Link>
      <Button variant="secondary" data-cy="logout-btn" onClick={handleLogout}>
        Logout
      </Button>
    </div>
  )
})
DashboardButtonGroup.displayName = 'DashboardButtonGroup'

export default DashboardButtonGroup
