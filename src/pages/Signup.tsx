import type { RouteComponentProps } from '@reach/router'
import { navigate } from '@reach/router'
import React, { useState } from 'react'

import type { Author } from '../../types'
import Layout from '../components/Layout'
import Button from '../elements/Button'
import { login } from '../redux/adminSlice'
import { useSignupReqestMutation } from '../redux/API'
import { useAppDispatch } from '../redux/hooks'
import { enque } from '../redux/snackbarSlice'

interface FormInputState {
  name: Author['name']
  password: Author['password']
}

const Signup: React.FC<RouteComponentProps> = () => {
  const [signupRequest] = useSignupReqestMutation()
  const [formInput, setFormInput] = useState<FormInputState>({
    name: '',
    password: '',
  })
  const dispatch = useAppDispatch()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormInput({ ...formInput, [e.target.name]: e.target.value })
  }

  const execSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      const data: Author = await signupRequest({
        name: formInput.name,
        password: formInput.password,
      }).unwrap()

      dispatch(enque({ message: 'Success Signup!', color: 'green' }))
      dispatch(login(data))
      // @TODO tidy up LocalStorage code
      window.localStorage.setItem('login', 'true')
      window.localStorage.setItem('author', JSON.stringify(data))
      navigate('dashboard')
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error)
      //@ TODO handle 400 error
    }
  }

  return (
    <Layout data-cy="signup-page-content-root">
      <h1 className="text-3xl mb-3">Signup</h1>
      <form className="w-full max-w-sm" onSubmit={execSignup}>
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
              data-cy="name-input"
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
}

export default React.memo(Signup, () => true)
