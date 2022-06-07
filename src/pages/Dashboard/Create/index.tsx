import { superstructResolver } from '@hookform/resolvers/superstruct'
import React, { memo } from 'react'
import { useForm, UseFormSetValue } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import { createPostFormValidator } from '../../../../validator/index'
import Button from '../../../components/Button/Button'
import Input from '../../../components/Input/Input'
import Layout from '../../../components/Layout/index'
import Textarea from '../../../components/Textarea/Textarea'
import { selectAuthor } from '../../../redux/adminSlice'
import {
  API,
  useGetStockListQuery,
  useDeleteStockMutation,
} from '../../../redux/API'
import { selectBody, selectTitle } from '../../../redux/draftSlice'
import type { FormInput } from '../../../redux/draftSlice'
import { useAppSelector } from '../../../redux/hooks'

import { handleBodyChange, handleTitleChange, onSubmit } from './handlers'

const Create: React.FC = memo(() => {
  // @ts-ignore
  const { data } = useGetStockListQuery()
  const [deleteStock] = useDeleteStockMutation()
  const navigate = useNavigate()
  const [createPost, { isLoading }] = API.endpoints.createPost.useMutation()
  const title = useAppSelector(selectTitle)
  const body = useAppSelector(selectBody)
  const author = useAppSelector(selectAuthor)

  const onClickHandler = async (
    id: Stock['id'],
    pageTitle: Stock['pageTitle'],
    url: Stock['url'],
    setValue: UseFormSetValue<any>
  ) => {
    // @TODO insert as a link to markdown edit
    const res = await deleteStock(id)
    setValue('body', pageTitle + url)

    // eslint-disable-next-line no-console
    console.log(res)
  }

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormInput>({
    resolver: superstructResolver(createPostFormValidator),
  })

  return (
    <div className="flex w-full gap-4">
      <form
        className="flex-grow-1 w-[70%] flex-shrink-0"
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
          reactHookFormParams={{ errors, name: 'body', register }}
          className="mt-3 h-96 w-full"
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
      <section className="text-color-inverse flex-grow-1 w-[400px] flex-shrink-0">
        <ul className="w-full">
          {data &&
            data.map((v: Stock, i: number) => {
              return (
                // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-noninteractive-element-interactions
                <li
                  onClick={() =>
                    onClickHandler(v.id, v.pageTitle, v.url, setValue)
                  }
                  className="mb-4 flex h-[64px] items-center overflow-y-scroll rounded-xl bg-green-300 bg-opacity-70 p-4 shadow-2xl hover:bg-opacity-100"
                  key={i}
                >
                  {v.pageTitle}
                </li>
              )
            })}
        </ul>
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
