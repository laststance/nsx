import type { RouteComponentProps } from '@reach/router'
import React, { memo } from 'react'

import Layout from '../../components/Layout'
import Button from '../../elements/Button'
import Loading from '../../elements/Loading'
import { assertIsDefined } from '../../lib/assertIsDefined'
import { useFetchPostQuery } from '../../redux/API'

import useEditEffect from './useEditEffect'

interface RouteParam {
  postId: Post['id']
}

const Edit: React.FC<RouteComponentProps<RouteParam>> = memo(
  ({ postId: id }) => {
    assertIsDefined(id)

    const { data, isLoading, error } = useFetchPostQuery(id)
    const { title, body, handleEdit, handleChange } = useEditEffect(
      id,
      data,
      error
    )

    if (isLoading || data === undefined) return <Loading />

    return (
      <Layout className="flex flex-col justify-start">
        <input
          type="text"
          className="mt-3"
          value={title}
          onChange={(e) => handleChange(e, 'title')}
          data-cy="edit-title-input"
        />
        <textarea
          className="w-full h-60 mt-3"
          value={body}
          onChange={(e) => handleChange(e, 'body')}
          data-cy="edit-body-input"
        />
        <div className="flex justify-end pt-8">
          <Button onClick={handleEdit} variant="secondary" data-cy="update-btn">
            Update
          </Button>
        </div>
      </Layout>
    )
  }
)

export default Edit
