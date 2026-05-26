import { zodResolver } from '@hookform/resolvers/zod'
import React, { memo } from 'react'
import { useForm } from 'react-hook-form'
import type { SubmitHandler, FieldValues } from 'react-hook-form'
import { useNavigate } from 'react-router'

import Button from '@/src/components/Button'
import Input from '@/src/components/Input/Input'
import Layout from '@/src/components/Layout'

import { userAccountValidator } from '../../../validator'
import { login } from '../../redux/adminSlice'
import { API } from '../../redux/API'
import isSuccess from '../../redux/helper/isSuccess'
import { enqueSnackbar } from '../../redux/snackbarSlice'
import { dispatch } from '../../redux/store'

interface FormInput extends FieldValues {
  name: User['name']
  password: string
}

const LOGIN_FAILED_MESSAGE = 'Invalid credentials'
const LOGIN_SERVICE_ERROR_MESSAGE =
  'Authentication service temporarily unavailable'

/**
 * Checks whether an unknown RTK Query error value can be inspected by key.
 *
 * Called only by the login error formatter before reading response metadata.
 *
 * @param value - Unknown value returned from RTK Query.
 * @returns True when the value is a non-null object.
 * @example isRecord({ status: 401 }) // true
 */
const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null
}

/**
 * Converts RTK Query login failures into user-facing snackbar text.
 *
 * Called by `onSubmit` after `loginReqest` returns an error result; credential
 * failures stay generic while service failures keep a distinct message.
 *
 * @param error - RTK Query error object from the login mutation.
 * @returns Message safe to show in the login snackbar.
 * @example getLoginErrorMessage({ status: 401, data: { code: 'AUTHENTICATION_FAILED' } })
 */
const getLoginErrorMessage = (error: unknown): string => {
  const errorRecord = isRecord(error) ? error : null
  const errorData = isRecord(errorRecord?.data) ? errorRecord.data : null

  // Only explicit credential failures use the account-safe generic message.
  if (
    errorRecord?.status === 401 &&
    errorData?.code === 'AUTHENTICATION_FAILED'
  ) {
    return LOGIN_FAILED_MESSAGE
  }

  // Server-side auth outages should not look like bad credentials.
  if (typeof errorData?.error === 'string') return errorData.error
  return LOGIN_SERVICE_ERROR_MESSAGE
}

const Login: React.FC = memo(() => {
  const navigate = useNavigate()
  const [loginReqest] = API.endpoints.loginReqest.useMutation()
  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<FormInput>({
    resolver: zodResolver(userAccountValidator),
  })

  const onSubmit: SubmitHandler<FormInput> = async (data) => {
    const res = await loginReqest({
      name: data.name,
      password: data.password,
    })

    // Login failures are intentionally generic to avoid account discovery.
    if ('error' in res && res.error) {
      console.error('Login request failed:', res.error)
      dispatch(
        enqueSnackbar({
          color: 'red',
          message: getLoginErrorMessage(res.error),
        }),
      )
      return
    }

    if (isSuccess(res) && 'data' in res) {
      const data = res.data

      // Login SuccessFul!
      dispatch(login(data))
      dispatch(enqueSnackbar({ color: 'green', message: 'Login SuccessFul!' }))

      navigate('/dashboard')
    }
  }

  return (
    <>
      <h1 className="text-color-primary mb-3 text-3xl">Login</h1>
      <form className="w-full max-w-sm" onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-6 md:flex md:items-center">
          <div className="md:w-1/3">
            <label
              className="mb-1 block pr-4 font-bold text-gray-500 md:mb-0 md:text-right"
              htmlFor="name"
            >
              Name
            </label>
          </div>
          <div className="md:w-2/3">
            <Input
              placeholder="name"
              reactHookFormParams={{
                name: 'name',
                fieldError: errors['name'],
                register,
              }}
              data-testid="name-input"
            />
          </div>
        </div>
        <div className="mb-6 md:flex md:items-center">
          <div className="md:w-1/3">
            <label
              className="mb-1 block pr-4 font-bold text-gray-500 md:mb-0 md:text-right"
              htmlFor="current-password"
            >
              Password
            </label>
          </div>
          <div className="md:w-2/3">
            <Input
              type="password"
              placeholder="password"
              reactHookFormParams={{
                name: 'password',
                fieldError: errors['password'],
                register,
              }}
              data-testid="password-input"
            />
          </div>
        </div>
        <div className="md:flex md:items-center">
          <div className="md:w-1/3"></div>
          <div className="md:w-2/3">
            <Button type="submit" variant="secondary" data-testid="submit-btn">
              Submit
            </Button>
          </div>
        </div>
      </form>
    </>
  )
})
Login.displayName = 'Login'

const LoginPage = memo(() => (
  <Layout>
    <Login />
  </Layout>
))
LoginPage.displayName = 'LoginPage'

export default LoginPage
