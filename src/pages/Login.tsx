import React, { useState } from 'react'
import { RouteComponentProps, navigate } from '@reach/router'
import { Dispatch } from 'redux'
import { useDispatch } from 'react-redux'
import Layout from '../components/Layout'
import { Author } from '../../DataStructure'
import axios from 'axios'
import { EnqueueSnackbarAction, LoginAction } from '../redux'

interface FormInputState {
  name: Author['name']
  password: string
}

interface LoginRequestResponse {
  author: Author
  message: string
}

const Login: React.FC<RouteComponentProps> = () => {
  const [formInput, setFormInput] = useState<FormInputState>({
    name: '',
    password: '',
  })
  const dispatch: Dispatch<LoginAction | EnqueueSnackbarAction> = useDispatch()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // @ts-ignore
    setFormInput({ ...formInput, [e.target.name]: e.target.value })
  }

  const execLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      const { status, data } = await axios.post<LoginRequestResponse>(
        `${process.env.REACT_APP_API_ENDPOINT}/login`,
        {
          name: formInput.name,
          password: formInput.password,
        }
      )

      if (status === 200) {
        dispatch({ type: 'LOGIN', payload: { author: data.author } })
        window.localStorage.setItem('login', 'true')
        window.localStorage.setItem('author', JSON.stringify(data.author))

        navigate('dashboard')
      } else if (status === 400) {
        dispatch({
          type: 'ENQUEUE_SNACKBAR_MESSAGE',
          payload: { message: 'Invalid Password', color: 'red' },
        })
      } else if (status === 401) {
        dispatch({
          type: 'ENQUEUE_SNACKBAR_MESSAGE',
          payload: { message: 'User does not exis', color: 'red' },
        })
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error)
      dispatch({
        type: 'ENQUEUE_SNACKBAR_MESSAGE',
        payload: { message: error.message, color: 'red' },
      })
    }
  }

  return (
    <Layout>
      <h1 className="text-3xl mb-3">Login</h1>
      <form className="w-full max-w-sm" onSubmit={(e) => execLogin(e)}>
        <div className="md:flex md:items-center mb-6">
          <div className="md:w-1/3">
            <label
              className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
              htmlFor="name"
            >
              Name
            </label>
          </div>
          <div className="md:w-2/3">
            <input
              className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
              id="name"
              type="text"
              name="name"
              onChange={(e) => handleChange(e)}
              value={formInput.name}
            />
          </div>
        </div>
        <div className="md:flex md:items-center mb-6">
          <div className="md:w-1/3">
            <label
              className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
              htmlFor="password"
            >
              Password
            </label>
          </div>
          <div className="md:w-2/3">
            <input
              className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
              id="password"
              type="password"
              name="password"
              onChange={(e) => handleChange(e)}
            />
          </div>
        </div>
        <div className="md:flex md:items-center">
          <div className="md:w-1/3"></div>
          <div className="md:w-2/3">
            <button
              className="shadow bg-blue-500 hover:bg-blue-500 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
              type="submit"
            >
              Submit
            </button>
          </div>
        </div>
      </form>
    </Layout>
  )
}

export default React.memo(Login)
