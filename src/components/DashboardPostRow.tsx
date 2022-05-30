import React, { memo } from 'react'
import { Link } from 'react-router-dom'

import { handleDelete } from '../pages/Dashboard/handler'

import Button from './Button/Button'
import PostDate from './PostDate/PostDate'

interface Props {
  post: Post
  index: number
  author: Author
  refetch: () => void
}

const DashboardPostRow: React.FC<Props> = memo(
  ({ post, author, refetch, index }) => {
    return (
      <li className="flex sm:flex-nowrap sm:space-x-2.5">
        <PostDate date={post.createdAt} />
        <div className="w-64 flex-initial break-all text-lg sm:w-auto">
          <Link
            className="text-color-primary hover:text-gray-400"
            to={`post/${post.id}`}
            data-cy={`single-post-page-link-${index + 1}`}
          >
            {post.title}
          </Link>
          <div className="flex items-center space-x-2">
            <Link to={`/dashboard/edit/${post.id}`}>
              <Button variant="inverse">Edit</Button>
            </Link>
            <Button
              onClick={handleDelete(post.id, author, refetch)}
              variant="danger"
              data-cy={`delete-btn-${index + 1}`}
            >
              Delete
            </Button>
          </div>
        </div>
      </li>
    )
  }
)
DashboardPostRow.displayName = 'DashboardPostRowPostRow'

export default DashboardPostRow
