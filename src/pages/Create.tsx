import type { RouteComponentProps } from '@reach/router'
import { navigate } from '@reach/router'
import React, { useState } from 'react'

import Layout from '../components/Layout'
import Button from '../elements/Button'
import { useCreatePostMutation } from '../redux/API'
import { useAppDispatch } from '../redux/hooks'
import { enque } from '../redux/snackbarSlice'

const Create: React.FC<RouteComponentProps> = () => {
  const dispatch = useAppDispatch()
  const [createPost] = useCreatePostMutation()

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [title, setTitle] = useState<string | undefined>('')
  const [body, setBody] = useState<string | undefined>('')

  function handleInputChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    setState: React.Dispatch<React.SetStateAction<string | undefined>>
  ): void {
    e.preventDefault()
    setState(e.target.value)
  }

  async function execCreate() {
    try {
      setIsSubmitting(() => true)
      // @ts-ignore
      const { data } = await createPost({
        title,
        body,
      }).unwrap()

      dispatch(enque({ message: 'New Post Created!', color: 'green' }))
      navigate(`/post/${data.id}`)
    } catch (error) {
      dispatch(enque({ message: error.message, color: 'red' }))
    } finally {
      setIsSubmitting(() => false)
    }
  }

  return (
    <Layout className="flex flex-col justify-start">
      <input
        type="text"
        className="mt-3"
        value={title}
        onChange={(e) => handleInputChange(e, setTitle)}
      />
      <textarea
        className="w-full h-60 mt-3"
        value={body}
        onChange={(e) => handleInputChange(e, setBody)}
      />
      <div className="flex gap-4 justify-end pt-8">
        <Button onClick={execCreate} variant="primary" isLoading={isSubmitting}>
          Submit
        </Button>
      </div>
    </Layout>
  )
}

export default React.memo(Create)
