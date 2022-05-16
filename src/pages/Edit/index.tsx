import { superstructResolver } from '@hookform/resolvers/superstruct'
import React, { memo } from 'react'
import { useForm } from 'react-hook-form'
import { useParams, useNavigate } from 'react-router-dom'

import { assertIsDefined } from '../../../lib/assertIsDefined'
import { editPostFormValidator } from '../../../validator/index'
import Button from '../../components/Button'
import Input from '../../components/Input'
import Layout from '../../components/Layout'
import Loading from '../../components/Loading'
import RTKQueryErrorMessages from '../../components/RTKQueryErrorMessages'
import Textarea from '../../components/Textarea'
import { selectAuthor } from '../../redux/adminSlice'
import { API } from '../../redux/API'
import type { FormInput } from '../../redux/draftSlice'
import { useAppSelector, useAppDispatch } from '../../redux/hooks'

import { onSubmit } from './handlers'

const Edit: React.FC = memo(() => {
  const { postId: id } = useParams() as unknown as { postId: number }
  assertIsDefined(id)

  const { data, isLoading, error } = API.endpoints.fetchPost.useQuery(id)
  const [updatePost, { isLoading: isUpdating }] =
    API.endpoints.updatePost.useMutation()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const author = useAppSelector(selectAuthor)
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<FormInput>({
    resolver: superstructResolver(editPostFormValidator),
  })

  if (error) {
    return <RTKQueryErrorMessages error={error} />
  }

  if (isLoading || data === undefined) {
    return <Loading />
  }

  return (
    <form
      data-testid="edit-form"
      onSubmit={handleSubmit(() =>
        onSubmit(updatePost, author, getValues, navigate, id, dispatch)
      )}
    >
      <Input
        defaultValue={data.title}
        reactHookFormPrams={{ errors, name: 'title', register }}
        data-cy="edit-title-input"
        data-testid="edit-title-input"
      />
      <Textarea
        defaultValue={data.body}
        reactHookFormParams={{ errors, name: 'body', register }}
        className="mt-3 h-96 w-full"
        data-cy="edit-body-input"
        data-testid="edit-body-input"
      />
      <div className="flex justify-end gap-4 pt-8">
        <Button
          type="submit"
          variant="secondary"
          data-cy="update-btn"
          isLoading={isUpdating}
        >
          Update
        </Button>
      </div>
    </form>
  )
})
Edit.displayName = 'Edit'

const EditPage = memo(() => (
  <Layout className="flex flex-col justify-start">
    <Edit />
  </Layout>
))

export default EditPage
