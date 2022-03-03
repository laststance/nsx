import React, { memo } from 'react'
import { useParams } from 'react-router-dom'

import { assertIsDefined } from '../../../lib/assertIsDefined'
import Button from '../../components/Button'
import BaseLayout from '../../components/Layout'
import Loading from '../../components/Loading'
import RTKQueryErrorMessages from '../../components/RTKQueryErrorMessages'
import { API } from '../../redux/API'

import useEditEffect from './useEditEffect'

const Layout: React.FC = memo(({ children }) => (
  <BaseLayout className="flex flex-col justify-start">{children}</BaseLayout>
))
Layout.displayName = 'Layout'

const Edit: React.FC = memo(() => {
  const { postId: id } = useParams() as unknown as { postId: number }
  assertIsDefined(id)

  const { data, isLoading, error } = API.endpoints.fetchPost.useQuery(id)
  const { title, body, handleEdit, handleChange } = useEditEffect(
    id,
    data,
    error
  )

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

  return (
    <Layout>
      <input
        type="text"
        className="mt-3"
        value={title}
        onChange={(e) => handleChange(e, 'title')}
        data-cy="edit-title-input"
      />
      <textarea
        className="h-60 w-full mt-3"
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
})
Edit.displayName = 'Edit'

export default Edit
