import { superstructResolver } from '@hookform/resolvers/superstruct'
import React, { memo } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router'

import Button from '@/src/components/Button'
import Input from '@/src/components/Input/Input'
import Layout from '@/src/components/Layout'
import Textarea from '@/src/components/Textarea/Textarea'

import { createPostFormValidator } from '../../../../validator'
import { selectAuthor } from '../../../redux/adminSlice'
import { API } from '../../../redux/API'
import { selectBody, selectTitle } from '../../../redux/draftSlice'
import type { FormInput } from '../../../redux/draftSlice'
import { useAppSelector } from '../../../redux/hooks'

import { handleBodyChange, handleTitleChange, onSubmit } from './handlers'
import StockList from './StockList'

const Create: React.FC = memo(() => {
  const navigate = useNavigate()
  const [createPost, { isLoading }] = API.endpoints.createPost.useMutation()
  const title = useAppSelector(selectTitle)
  const body = useAppSelector(selectBody)
  const author = useAppSelector(selectAuthor)
  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<FormInput>({
    resolver: superstructResolver(createPostFormValidator),
  })

  return (
    <div className="flex w-full">
      <section className="w-[70%]">
        <form
          onSubmit={handleSubmit(async () =>
            onSubmit(createPost, title, body, author, navigate),
          )}
        >
          <Input
            placeholder="Post Title"
            reactHookFormParams={{
              name: 'title',
              fieldError: errors['title'],
              register,
            }}
            onChange={handleTitleChange}
            data-testid="post-title-input"
          />
          <Textarea
            value={body}
            reactHookFormParams={{
              name: 'body',
              fieldError: errors['body'],
              register,
            }}
            className="mt-3 h-96 w-full"
            onChange={handleBodyChange}
          />
          <div className="flex justify-end gap-4 pt-8">
            <Button
              type="submit"
              variant="primary"
              isLoading={isLoading}
              data-testid="submit-btn"
            >
              Submit
            </Button>
          </div>
        </form>
      </section>
      <section className="ml-4 w-[30%] overflow-x-visible">
        <StockList />
      </section>
    </div>
  )
})
Create.displayName = 'Create'

const CreatePage = memo(() => (
  <Layout className="flex flex-col justify-start">
    <Create />
  </Layout>
))
CreatePage.displayName = 'CreatePage'

export default CreatePage
