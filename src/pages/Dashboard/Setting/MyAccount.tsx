import { superstructResolver } from '@hookform/resolvers/superstruct'
import React, { memo } from 'react'
import { useForm } from 'react-hook-form'
import type { FieldValues } from 'react-hook-form'

import Button from '@/src/components/Button'
import Input from '@/src/components/Input/Input'

import { userAccountValidator } from '../../../../validator'

const mockOnSubmit = (v: any) => console.log(v)
interface FormInput extends FieldValues {
  name: Author['name']
  password: Author['password']
}

const MyAccount: React.FC = memo(() => {
  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<FormInput>({
    resolver: superstructResolver(userAccountValidator),
  })

  return (
    <>
      <h1
        className="text-color-primary text-center text-3xl"
        data-testid="my-account-setting"
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
MyAccount.displayName = 'MyAccount'

export default MyAccount
