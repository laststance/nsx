import React, { memo } from 'react'
import { Link } from 'react-router'

import Button from '@/src/components/Button'
import Layout from '@/src/components/Layout'
import Loading from '@/src/components/Loading'
import PaginationButtonGroup from '@/src/components/Pagination/ButtonGroup'
import usePagination from '@/src/components/Pagination/usePagination'
import RTKQueryErrorMessages from '@/src/components/RTKQueryErrorMessages/RTKQueryErrorMessages'

import { selectUser } from '../../redux/adminSlice'
import { useAppSelector } from '../../redux/hooks'

import DashboardPostRow from './DashboardPostRow'

const Dashboard: React.FC = memo(() => {
  const { data, error, isLoading, page, refetch, totalPage } = usePagination(10)
  const user = useAppSelector(selectUser)

  if (error) {
    return <RTKQueryErrorMessages error={error} />
  }

  if (isLoading || data === undefined) {
    return <Loading />
  }
  const { postList } = data

  return (
    <>
      <h1 className="text-color-primary mb-3 text-center text-3xl font-semibold">
        Dashboard
      </h1>
      <div className="flex h-full flex-col justify-between">
        <ul className="post-row-container">
          {postList.map((post: Post, i: number) => {
            return (
              <DashboardPostRow
                key={i}
                post={post}
                index={i}
                author={user}
                refetch={refetch}
              />
            )
          })}
        </ul>
        <div className="mt-8 flex justify-end gap-4">
          <Link to="create">
            <Button data-testid="create-btn" variant="primary">
              Create
            </Button>
          </Link>
        </div>
        <PaginationButtonGroup page={page} totalPage={totalPage} />
      </div>
    </>
  )
})
Dashboard.displayName = 'Dashborad'

const DashboardPage = memo(() => (
  <Layout
    disableBaseStyle
    className="mx-auto flex grow flex-col justify-start px-4 py-4 sm:w-full lg:container"
  >
    <Dashboard />
  </Layout>
))
DashboardPage.displayName = 'DashboardPage'

export default DashboardPage
