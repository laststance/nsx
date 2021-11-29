import type { RouteComponentProps } from '@reach/router'
import { navigate } from '@reach/router'
import React, { useState, memo } from 'react'

import Layout from '../../components/Layout'
import Button from '../../elements/Button'
import { API } from '../../redux/API'
import { clearDraft, selectBody, selectTitle } from '../../redux/draftSlice'
import isSuccess from '../../redux/helper/isSuccess'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import { enqueSnackbar } from '../../redux/snackbarSlice'

import {
  handleBodyChange,
  handleTitleChange,
} from './useCallbackMemoizedByV8JavaScriptEngine'

const Create: React.FC<RouteComponentProps> = memo(() => {
  const dispatch = useAppDispatch()
  const [createPost] = API.endpoints.createPost.useMutation()

  // @TODO avoid complex implemantation with useStrate() spaming
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const title = useAppSelector(selectTitle)
  const body = useAppSelector(selectBody)

  async function handleSubmit() {
    setIsSubmitting(() => true)

    const post = await createPost({
      title,
      body,
    })
    if (isSuccess(post) && 'data' in post) {
      dispatch(enqueSnackbar({ message: 'New Post Created!', color: 'green' }))
      dispatch(clearDraft())
      setIsSubmitting(() => false)

      navigate(`/post/${post.data.id}`)
    }
  }

  return (
    <Layout className="flex flex-col justify-start">
      <input
        defaultValue={title}
        type="text"
        className="mt-3"
        onChange={(e) => handleTitleChange(e, dispatch)}
        data-cy="post-title-input"
      />
      <textarea
        className="h-60 w-full mt-3"
        defaultValue={body}
        onChange={(e) => handleBodyChange(e, dispatch)}
        data-cy="post-body- input"
      />
      <div className="flex justify-end gap-4 pt-8">
        <Button
          onClick={handleSubmit}
          variant="primary"
          isLoading={isSubmitting}
          data-cy="submit-btn"
        >
          Submit
        </Button>
      </div>
    </Layout>
  )
})
Create.displayName = 'Create'

export default Create
