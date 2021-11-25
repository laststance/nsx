import { Link } from '@reach/router'
import type { RouteComponentProps } from '@reach/router'
import React, { memo } from 'react'

import BaseLayout from '../../components/Layout'
import Pagenation from '../../components/pagination/Pagenation'
import usePagination from '../../components/pagination/usePagination'
import Button from '../../elements/Button'
import Loading from '../../elements/Loading'
import PostDate from '../../elements/PostDate'
import RTKQueryErrorMessages from '../../elements/RTKQueryErrorMessages'
import { useDeletePostMutation } from '../../redux/API'
import { assertIsFetchBaseQueryError } from '../../redux/helper/assertIsFetchBaseQueryError'
import { assertIsSerializedError } from '../../redux/helper/assertIsSerializedError'
import { enqueSnackbar } from '../../redux/snackbarSlice'

const Layout: React.FC = memo(({ children, ...rest }) => (
  <BaseLayout
    className="flex flex-col justify-start"
    data-cy="dashboard-page-content-root"
    {...rest}
  >
    {children}
  </BaseLayout>
))
Layout.displayName = 'Layout'

const Dashboard: React.FC<RouteComponentProps> = memo(() => {
  const {
    page,
    totalPage,
    data,
    error,
    isLoading,
    dispatch,
    refetch,
    prevPage,
    nextPage,
  } = usePagination()
  const [deletePost] = useDeletePostMutation()

  async function handleDelete(id: Post['id']) {
    try {
      const res = await deletePost(id).unwrap()

      dispatch(enqueSnackbar({ message: res.message, color: 'green' }))
      refetch()
    } catch (error) {
      assertIsSerializedError(error)
      assertIsFetchBaseQueryError(error)
      const message =
        error.status === 500
          ? `Delete Faild: ${error.message}`
          : `${error.status} System Error. Delete Faild: ${error.message}`
      dispatch(enqueSnackbar({ message: message, color: 'red' }))
    }
  }

  if (error) {
    return (
      <Layout>
        <RTKQueryErrorMessages error={error} />
      </Layout>
    )
  }

  if (isLoading || data === undefined) {
    return (
      <Layout>
        <Loading />
      </Layout>
    )
  }
  const { postList } = data

  return (
    <Layout>
      <h1 className="mb-3 text-3xl font-semibold">Dashboard</h1>
      <div className="flex flex-col justify-between h-full">
        <ul className="flex flex-col justify-start">
          {postList.map((post: Post, i: number) => {
            return (
              <li
                key={i}
                className="flex items-center justify-between space-y-2"
              >
                <Link
                  to={`/post/${post.id}`}
                  className="flex items-center space-x-2"
                >
                  <PostDate date={post.createdAt} />
                  <div className="text-base">{post.title}</div>
                </Link>
                <div className="flex items-center space-x-2">
                  <Link to={`/dashboard/edit/${post.id}`}>
                    <Button variant="inverse">Edit</Button>
                  </Link>
                  <Button
                    onClick={() => handleDelete(post.id)}
                    variant="danger"
                    data-cy={`delete-btn-${i + 1}`}
                  >
                    Delete
                  </Button>
                </div>
              </li>
            )
          })}
        </ul>
        <div className="flex justify-end gap-4 mt-8">
          <Link to="create">
            <Button data-cy="create-btn" variant="primary">
              Create
            </Button>
          </Link>
        </div>
        <Pagenation
          page={page}
          totalPage={totalPage}
          dispatch={dispatch}
          prevPage={prevPage}
          nextPage={nextPage}
        />
      </div>
    </Layout>
  )
})

export default Dashboard
