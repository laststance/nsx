import { superstructResolver } from '@hookform/resolvers/superstruct'
import React, { memo } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import { createPostFormValidator } from '../../../validator/index'
import Button from '../../components/Button'
import Input from '../../components/Input'
import Layout from '../../components/Layout'
import Textarea from '../../components/Textarea'
import { selectAuthor } from '../../redux/adminSlice'
import { API } from '../../redux/API'
import { selectBody, selectTitle } from '../../redux/draftSlice'
import type { FormInput } from '../../redux/draftSlice'
import { useAppSelector } from '../../redux/hooks'

import { handleBodyChange, handleTitleChange, onSubmit } from './handlers'

const Create: React.FC = memo(() => {
  const navigate = useNavigate()
  const [createPost, { isLoading }] = API.endpoints.createPost.useMutation()
  const title = useAppSelector(selectTitle)
  const body = useAppSelector(selectBody)
  const author = useAppSelector(selectAuthor)

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
          onSubmit(createPost, title, body, author, navigate)
        )}
      >
        <Input
          defaultValue={title}
          type="text"
          reactHookFormPrams={{ errors, name: 'title', register }}
          onChange={handleTitleChange}
          data-cy="post-title-input"
        />
        <Textarea
          defaultValue={body}
          register={register}
          name="body"
          className="mt-3 h-96 w-full"
          errors={errors}
          onChange={handleBodyChange}
        />
        <div className="flex justify-end gap-4 pt-8">
          <Button
            type="submit"
            variant="primary"
            isLoading={isLoading}
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
