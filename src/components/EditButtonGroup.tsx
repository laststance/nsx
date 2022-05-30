import React, { memo } from 'react'
import { Link } from 'react-router-dom'

import { handleDelete } from '../pages/Dashboard/handler'

import Button from './Button/Button'

interface Props {
  post: Post
  author: Author
  refetch: () => void
  index: number
}

const EditButtonGroup: React.FC<Props> = memo(
  ({ post, author, refetch, index }) => {
    return (
      <div className="flex w-full justify-end space-x-2">
        <Link to={`/dashboard/edit/${post.id}`}>
          <Button variant="inverse">Edit</Button>
        </Link>
        <Button
          onClick={handleDelete(post.id, author, refetch)}
          variant="danger"
          data-cy={`delete-btn-${index + 1}`}
          className="h-[42px] border"
        >
          Delete
        </Button>
      </div>
    )
  }
)
EditButtonGroup.displayName = 'EditButtonGroup'

export default EditButtonGroup
