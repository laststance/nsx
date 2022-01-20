import React, { memo } from 'react'
import { useNavigate } from 'react-router-dom'

import Layout from '../../components/Layout'
import Button from '../../elements/Button'
import { selectAuthor } from '../../redux/adminSlice'
import { API } from '../../redux/API'
import { selectLoading } from '../../redux/applicationSlice'
import { selectBody, selectTitle } from '../../redux/draftSlice'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'

import { handleBodyChange, handleTitleChange, handleSubmit } from './handlers'

const Create: React.FC = memo(() => {
  const navigate = useNavigate()
  const [createPost] = API.endpoints.createPost.useMutation()

  const isSubmitting = useAppSelector(selectLoading)
  const title = useAppSelector(selectTitle)
  const body = useAppSelector(selectBody)
  const author = useAppSelector(selectAuthor)
  const dispatch = useAppDispatch()

  return (
    <Layout className="flex flex-col justify-start">
      <input
        defaultValue={title}
        type="text"
        className="mt-3"
        onChange={handleTitleChange}
        data-cy="post-title-input"
      />
      <textarea
        className="h-60 w-full mt-3"
        defaultValue={body}
        onChange={handleBodyChange}
        data-cy="post-body-input"
      />
      <div className="flex justify-end gap-4 pt-8">
        <Button
          onClick={() =>
            handleSubmit(createPost, title, body, author, dispatch, navigate)
          }
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
