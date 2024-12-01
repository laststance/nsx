import React, { memo } from 'react'
import { Link } from 'react-router'

import Button from '@/src/components/Button'
import type { UsePagenationResult } from '@/src/components/Pagination/usePagination'

import { handleDelete } from './handler'

interface Props {
  author: Author
  index: number
  post: Post
  refetch: UsePagenationResult['refetch']
}

const EditButtonGroup: React.FC<Props> = memo(
  ({ author, index, post, refetch }) => {
    return (
      <div className="flex w-full justify-end space-x-2">
        <Link to={`/dashboard/edit/${post.id}`}>
          <Button variant="inverse">Edit</Button>
        </Link>
        <Button
          onClick={handleDelete(post.id, author, refetch)}
          variant="danger"
          data-testid={`delete-btn-${index + 1}`}
          className="h-[42px]"
        >
          Delete
        </Button>
      </div>
    )
  },
)
EditButtonGroup.displayName = 'EditButtonGroup'

export default EditButtonGroup
