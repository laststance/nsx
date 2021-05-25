import React, { useState } from 'react'
import { RouteComponentProps } from '@reach/router'
import axios from 'axios'
import Layout from '../components/Layout'

const Create: React.FC<RouteComponentProps> = () => {
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
      const { status } = await axios.post(
        `${process.env.REACT_APP_API_ENDPOINT}/create`,
        {
          title,
          body,
        }
      )

      if (status === 201) {
        // @TODO success
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error)
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

export default Create
