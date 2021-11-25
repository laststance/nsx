import type { RouteComponentProps } from '@reach/router'
import { navigate } from '@reach/router'
import React, { useState, memo } from 'react'

import Layout from '../../components/Layout'
import Button from '../../elements/Button'
import { API } from '../../redux/API'
import isSuccess from '../../redux/helper/isSuccess'
import { useAppDispatch } from '../../redux/hooks'
import { enqueSnackbar } from '../../redux/snackbarSlice'

const Create: React.FC<RouteComponentProps> = memo(() => {
  const dispatch = useAppDispatch()
  const [createPost] = API.endpoints.createPost.useMutation()

  // @TODO avoid complex implemantation with useStrate() spaming
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [title, setTitle] = useState<string>('')
  const [body, setBody] = useState<string>('')

  function handleInputChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    setState: React.Dispatch<React.SetStateAction<string>>
  ): void {
    e.preventDefault()
    setState(e.target.value)
  }

  async function handleSubmit() {
    setIsSubmitting(() => true)

    const post = await createPost({
      title,
      body,
    })
    if (isSuccess(post) && 'data' in post) {
      dispatch(enqueSnackbar({ message: 'New Post Created!', color: 'green' }))
      setIsSubmitting(() => false)

      navigate(`/post/${post.data.id}`)
    }
  }

  return (
    <Layout className="flex flex-col justify-start">
      <input
        type="text"
        className="mt-3"
        value={title}
        onChange={(e) => handleInputChange(e, setTitle)}
        data-cy="post-title-input"
      />
      <textarea
        className="h-60 w-full mt-3"
        value={body}
        onChange={(e) => handleInputChange(e, setBody)}
        data-cy="post-body-input"
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

export default Create
