import { superstructResolver } from '@hookform/resolvers/superstruct'
import React, { memo } from 'react'
import { useForm } from 'react-hook-form'
import type { SubmitHandler, FieldValues } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import { loginFormValidator } from '../../../validator'
import Layout from '../../components/Layout'
import Button from '../../elements/Button'
import Input from '../../elements/Input'
import { login } from '../../redux/adminSlice'
import { API } from '../../redux/API'
import isSuccess from '../../redux/helper/isSuccess'
import { useAppDispatch } from '../../redux/hooks'
import { enqueSnackbar } from '../../redux/snackbarSlice'

interface FormInput extends FieldValues {
  name: Author['name']
  password: Author['password']
}

const Login: React.FC = memo(() => {
  const navigate = useNavigate()
  const [loginReqest] = API.endpoints.loginReqest.useMutation()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInput>({ resolver: superstructResolver(loginFormValidator) })
  const dispatch = useAppDispatch()

  const onSubmit: SubmitHandler<FormInput> = async (data) => {
    const res = await loginReqest({
      name: data.name,
      password: data.password,
    })

    if (isSuccess(res) && 'data' in res) {
      const data = res.data
      if ('faild' in data) {
        dispatch(enqueSnackbar({ message: data.faild, color: 'red' }))
        return // missing username or pass, onemore time!
      }

      // Login SuccessFul!
      dispatch(login(data))
      dispatch(enqueSnackbar({ message: 'Login SuccessFul!', color: 'green' }))

      navigate('/dashboard')
    }
  }

  return (
    <Layout>
      <h1 className="mb-3 text-3xl">Login</h1>
      <form className="w-full max-w-sm" onSubmit={handleSubmit(onSubmit)}>
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
            <Input
              type="text"
              name="name"
              register={register}
              errors={errors}
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
            <Input
              type="password"
              name="password"
              register={register}
              errors={errors}
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
Login.displayName = 'Login'

export default Login
