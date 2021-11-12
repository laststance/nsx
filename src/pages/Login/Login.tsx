import type { RouteComponentProps } from '@reach/router'
import { navigate } from '@reach/router'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import React, { useState, memo } from 'react'

import Layout from '../../components/Layout'
import Button from '../../elements/Button'
import { login } from '../../redux/adminSlice'
import { API } from '../../redux/API'
import { useAppDispatch } from '../../redux/hooks'
import { enqueSnackbar } from '../../redux/snackbarSlice'

interface FormInputState {
  name: Author['name']
  password: Author['password']
}

const Login: React.FC<RouteComponentProps> = memo(() => {
  const [loginReqest] = API.endpoints.loginReqest.useMutation()
  const [formInput, setFormInput] = useState<FormInputState>({
    name: '',
    password: '',
  })
  const dispatch = useAppDispatch()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormInput({ ...formInput, [e.target.name]: e.target.value })
  }

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
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
      dispatch(enqueSnackbar({ message: 'Login SuccessFul', color: 'green' }))
      navigate('dashboard')
      // @ts-ignore disabled TS1196: Catch clause variable type annotation must be 'any' or 'unknown' if specified.
    } catch (error: FetchBaseQueryError) {
      if (error.status === 400)
        dispatch(enqueSnackbar({ message: 'Invalid Password', color: 'red' }))
      if (error.status === 401)
        dispatch(enqueSnackbar({ message: 'User does not exis', color: 'red' }))
      else dispatch(enqueSnackbar({ message: 'something error', color: 'red' }))
    }
  }

  return (
    <Layout>
      <h1 className="mb-3 text-3xl">Login</h1>
      <form className="w-full max-w-sm" onSubmit={(e) => handleLogin(e)}>
        <div className="md:flex md:items-center mb-6">
          <div className="md:w-1/3">
            <label
              className="md:text-right md:mb-0 block pr-4 mb-1 font-bold text-gray-500"
              htmlFor="name"
            >
              Name
            </label>
          </div>
          <div className="md:w-2/3">
            <input
              className="focus:outline-none focus:bg-white focus:border-purple-500 w-full px-4 py-2 leading-tight text-gray-700 bg-gray-200 border-2 border-gray-200 rounded appearance-none"
              id="name"
              type="text"
              name="name"
              onChange={(e) => handleChange(e)}
              value={formInput.name}
              data-cy="name-input"
            />
          </div>
        </div>
        <div className="md:flex md:items-center mb-6">
          <div className="md:w-1/3">
            <label
              className="md:text-right md:mb-0 block pr-4 mb-1 font-bold text-gray-500"
              htmlFor="password"
            >
              Password
            </label>
          </div>
          <div className="md:w-2/3">
            <input
              className="focus:outline-none focus:bg-white focus:border-purple-500 w-full px-4 py-2 leading-tight text-gray-700 bg-gray-200 border-2 border-gray-200 rounded appearance-none"
              id="password"
              type="password"
              name="password"
              onChange={(e) => handleChange(e)}
              data-cy="password-input"
            />
          </div>
        </div>
        <div className="md:flex md:items-center">
          <div className="md:w-1/3"></div>
          <div className="md:w-2/3">
            <Button type="submit" variant="secondary" data-cy="submit-btn">
              Submit
            </Button>
          </div>
        </div>
      </form>
    </Layout>
  )
})

export default Login
