import { superstructResolver } from '@hookform/resolvers/superstruct'
import React, { memo } from 'react'
import { useForm } from 'react-hook-form'
import { useParams, useNavigate } from 'react-router-dom'

import { assertIsDefined } from '../../../../lib/assertIsDefined'
import { editPostFormValidator } from '../../../../validator'
import Button from '../../../components/Button/Button'
import Input from '../../../components/Input/Input'
import Layout from '../../../components/Layout'
import Loading from '../../../components/Loading'
import RTKQueryErrorMessages from '../../../components/RTKQueryErrorMessages/RTKQueryErrorMessages'
import Textarea from '../../../components/Textarea/Textarea'
import { selectAuthor } from '../../../redux/adminSlice'
import { API } from '../../../redux/API'
import type { FormInput } from '../../../redux/draftSlice'
import { useAppSelector } from '../../../redux/hooks'
import { dispatch } from '../../../redux/store'

import { onSubmit } from './handlers'

const Edit: React.FC = memo(() => {
  const { postId: id } = useParams() as unknown as { postId: number }
  assertIsDefined(id)

  const { data, error, isLoading } = API.endpoints.fetchPost.useQuery(id)
  const [updatePost, { isLoading: isUpdating }] =
    API.endpoints.updatePost.useMutation()
  const navigate = useNavigate()
  const author = useAppSelector(selectAuthor)
  const {
    formState: { errors },
    getValues,
    handleSubmit,
    register,
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
      onSubmit={handleSubmit(async () =>
        onSubmit(updatePost, author, getValues, navigate, id, dispatch),
      )}
    >
      <Input
        defaultValue={data.title}
        reactHookFormPrams={{
          name: 'title',
          fieldError: errors['title'],
          register,
        }}
        data-testid="edit-title-input"
      />
      <Textarea
        defaultValue={data.body}
        reactHookFormParams={{
          name: 'body',
          fieldError: errors['body'],
          register,
        }}
        className="mt-3 h-96 w-full"
        data-testid="edit-body-input"
      />
      <div className="flex justify-end gap-4 pt-8">
        <Button
          type="submit"
          variant="secondary"
          data-testid="update-btn"
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
EditPage.displayName = 'EditPage'

export default EditPage
