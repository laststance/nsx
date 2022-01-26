import { superstructResolver } from '@hookform/resolvers/superstruct'
import React, { memo } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import { createPostFormValidator } from '../../../validator/index'
import Layout from '../../components/Layout'
import Button from '../../elements/Button'
import Input from '../../elements/Input'
import { selectAuthor } from '../../redux/adminSlice'
import { API } from '../../redux/API'
import { selectLoading } from '../../redux/applicationSlice'
import { selectBody, selectTitle } from '../../redux/draftSlice'
import type { DraftState } from '../../redux/draftSlice'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'

import { handleBodyChange, handleTitleChange, onSubmit } from './handlers'

interface FormInput {
  title: DraftState['title']
}

const Create: React.FC = memo(() => {
  const navigate = useNavigate()
  const [createPost] = API.endpoints.createPost.useMutation()

  const isSubmitting = useAppSelector(selectLoading)
  const title = useAppSelector(selectTitle)
  const body = useAppSelector(selectBody)
  const author = useAppSelector(selectAuthor)
  const dispatch = useAppDispatch()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInput>({
    resolver: superstructResolver(createPostFormValidator),
  })

  return (
    <Layout className="flex flex-col justify-start">
      <form
        onSubmit={handleSubmit(() =>
          onSubmit(createPost, title, body, author, dispatch, navigate)
        )}
      >
        <Input
          defaultValue={title}
          type="text"
          register={register}
          name="title"
          errors={errors}
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
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
            data-cy="submit-btn"
          >
            Submit
          </Button>
        </div>
      </form>
    </Layout>
  )
})
Create.displayName = 'Create'

export default Create
