import React, { useState } from 'react'
import type { RouteComponentProps } from '@reach/router'
import { navigate } from '@reach/router'
import { useAppDispatch } from '../redux/hooks'
import Layout from '../components/Layout'
import { useCreatePostMutation } from '../redux/api'
import { enque } from '../redux/snackbarSlice'

const Create: React.FC<RouteComponentProps> = () => {
  const dispatch = useAppDispatch()
  const [createPost] = useCreatePostMutation()

  const [title, setTitle] = useState<string | undefined>('')
  const [body, setBody] = useState<string | undefined>('')

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    cb: React.Dispatch<React.SetStateAction<string | undefined>>
  ): void {
    e.preventDefault()
    cb(e.target.value)
  }

  async function execCreate() {
    try {
      // @ts-ignore
      const { data } = await createPost({
        title,
        body,
      })
      dispatch(enque({ message: 'New Post Created!', color: 'green' }))
      navigate(`/post/${data.id}`)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error)
      dispatch(enque({ message: 'Something Error Occuring.', color: 'red' }))
    }
  }

  return (
    <Layout className="flex flex-col justify-start">
      <input
        type="text"
        className="mt-3"
        value={title}
        onChange={(e) => handleChange(e, setTitle)}
      />
      <textarea
        className="w-full h-60 mt-3"
        value={body}
        onChange={(e) => handleChange(e, setBody)}
      />
      <div className="flex gap-4 justify-end">
        <button
          onClick={execCreate}
          className="mt-3 shadow bg-green-400 hover:bg-green-500 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
        >
          Submit
        </button>
      </div>
    </Layout>
  )
}

export default React.memo(Create)
