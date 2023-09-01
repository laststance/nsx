import { superstructResolver } from '@hookform/resolvers/superstruct'
import React, { memo } from 'react'
import { useForm } from 'react-hook-form'
import type { FieldValues } from 'react-hook-form'

import { userAccountValidator } from '../../../../validator'
import Button from '../../../components/Button/Button'
import Input from '../../../components/Input/Input'

const mockOnSubmit = (v: any) => console.log(v)
interface FormInput extends FieldValues {
  name: Author['name']
  password: Author['password']
}

const MyAccount: React.FC = memo(() => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInput>({
    resolver: superstructResolver(userAccountValidator),
  })

  return (
    <>
      <h1
        className="text-color-primary text-center text-3xl"
        data-cy="my-account-setting"
      >
        My Account
      </h1>
      <form
        className="mx-auto w-full max-w-sm"
        onSubmit={handleSubmit(mockOnSubmit)}
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
                fieldError: errors['name'],
                name: 'name',
                register,
              }}
              data-cy="name-input"
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
                fieldError: errors['password'],
                name: 'password',
                register,
              }}
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
    </>
  )
})
MyAccount.displayName = 'MyAccount'

export default MyAccount
