import type { RouteComponentProps } from '@reach/router'
import { navigate } from '@reach/router'
import React, { useState } from 'react'

import type { Author } from '../../types'
import Layout from '../components/Layout'
import Button from '../elements/Button'
import { login } from '../redux/adminSlice'
import { useLoginReqestMutation } from '../redux/api'
import { useAppDispatch } from '../redux/hooks'
import { enque } from '../redux/snackbarSlice'

interface FormInputState {
  name: Author['name']
  password: string
}

const Login: React.FC<RouteComponentProps> = () => {
  const [loginReqest] = useLoginReqestMutation()
  const [formInput, setFormInput] = useState<FormInputState>({
    name: '',
    password: '',
  })
  const dispatch = useAppDispatch()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormInput({ ...formInput, [e.target.name]: e.target.value })
  }

  const execLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      // @TODO add validation
      const data: Author = await loginReqest({
        name: formInput.name,
        password: formInput.password,
      }).unwrap()

      dispatch(login(data))
      // @TODO tidy up LocalStorage code
      window.localStorage.setItem('login', 'true')
      window.localStorage.setItem('author', JSON.stringify(data))
      dispatch(enque({ message: 'Login SuccessFul', color: 'green' }))
      navigate('dashboard')
    } catch (error) {
      if (error.status === 400)
        dispatch(enque({ message: 'Invalid Password', color: 'red' }))
      if (error.status === 401)
        dispatch(enque({ message: 'User does not exis', color: 'red' }))
      else dispatch(enque({ message: 'something error', color: 'red' }))
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
            <Button type="submit" variant="secondary">
              Submit
            </Button>
          </div>
        </div>
      </form>
    </Layout>
  )
}

export default React.memo(Login)
