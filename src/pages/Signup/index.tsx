import { superstructResolver } from '@hookform/resolvers/superstruct'
import React, { memo } from 'react'
import { useForm } from 'react-hook-form'
import type { SubmitHandler, FieldValues } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import { userAccountValidator } from '../../../validator'
import Button from '../../components/Button/Button'
import Input from '../../components/Input/Input'
import { login } from '../../redux/adminSlice'
import { useSignupReqestMutation } from '../../redux/API'
import isSuccess from '../../redux/helper/isSuccess'
import { enqueSnackbar } from '../../redux/snackbarSlice'
import { dispatch } from '../../redux/store'

interface FormInput extends FieldValues {
  name: Author['name']
  password: Author['password']
}

const Signup: React.FC = memo(() => {
  const navigate = useNavigate()
  const [signupRequest] = useSignupReqestMutation()
  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<FormInput>({
    resolver: superstructResolver(userAccountValidator),
  })

  const onSubmit: SubmitHandler<FormInput> = async (data) => {
    const res = await signupRequest({
      name: data.name,
      password: data.password,
    })

    if (isSuccess(res) && 'data' in res) {
      dispatch(enqueSnackbar({ color: 'green', message: 'Success Signup!' }))
      dispatch(login(res.data))
      navigate('/dashboard')
    }
  }

  return (
    <section className="flex flex-col gap-[24px]">
      <h1
        className="text-color-primary text-center text-3xl"
        data-cy="signup-page"
      >
        Signup
      </h1>
      <form
        className="mx-auto w-full max-w-sm"
        onSubmit={handleSubmit(onSubmit)}
      >
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
              type="text"
              reactHookFormPrams={{
                name: 'name',
                fieldError: errors['name'],
                register,
              }}
              data-cy="signup-name-input"
            />
          </div>
        </div>
        <div className="mb-6 md:flex md:items-center">
          <div className="md:w-1/3">
            <label
              className="mb-1 block pr-4 font-bold text-gray-500 md:mb-0 md:text-right"
              htmlFor="password"
            >
              Password
            </label>
          </div>
          <div className="md:w-2/3">
            <Input
              type="password"
              reactHookFormPrams={{
                name: 'password',
                fieldError: errors['password'],
                register,
              }}
              data-cy="signup-password-input"
            />
          </div>
        </div>
        <div className="md:flex md:items-center">
          <div className="md:w-1/3"></div>
          <div className="md:w-2/3">
            <Button
              type="submit"
              variant="secondary"
              data-cy="signup-submit-btn"
            >
              Submit
            </Button>
          </div>
        </div>
      </form>
    </section>
  )
})
Signup.displayName = 'Signup'

export default Signup
