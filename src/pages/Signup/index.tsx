import type { RouteComponentProps } from '@reach/router'
import { navigate } from '@reach/router'
import React, { useState, memo } from 'react'

import Layout from '../../components/Layout'
import Button from '../../elements/Button'
import { login } from '../../redux/adminSlice'
import { useSignupReqestMutation } from '../../redux/API'
import isSuccess from '../../redux/helper/isSuccess'
import { useAppDispatch } from '../../redux/hooks'
import { enqueSnackbar } from '../../redux/snackbarSlice'

interface FormInputState {
  name: Author['name']
  password: Author['password']
}

const Signup: React.FC<RouteComponentProps> = memo(() => {
  const [signupRequest] = useSignupReqestMutation()
  const [formInput, setFormInput] = useState<FormInputState>({
    name: '',
    password: '',
  })
  const dispatch = useAppDispatch()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormInput({ ...formInput, [e.target.name]: e.target.value })
  }

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const res = await signupRequest({
      name: formInput.name,
      password: formInput.password,
    })

    if (isSuccess(res) && 'data' in res) {
      dispatch(enqueSnackbar({ message: 'Success Signup!', color: 'green' }))
      dispatch(login(res.data))
      navigate('dashboard')
    }
  }

  return (
    <Layout data-cy="signup-page-content-root">
      <h1 className="mb-3 text-3xl">Signup</h1>
      <form className="w-full max-w-sm" onSubmit={handleSignup}>
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
Signup.displayName = 'Signup'

export default Signup
