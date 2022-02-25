import { superstructResolver } from '@hookform/resolvers/superstruct'
import userEvent from '@testing-library/user-event'
import React from 'react'
import { act } from 'react-dom/test-utils'
import { useForm } from 'react-hook-form'
import { object } from 'superstruct'

import { name } from '../../validator/index'
import TestRenderer from '../lib/TestRenderer'

import Input from './Input'

interface FormInput {
  name: Author['name']
}

const formValidator = object({
  name: name,
})

const Form = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInput>({
    resolver: superstructResolver(formValidator),
  })

  return (
    <>
      <form onSubmit={handleSubmit(() => {})}>
        <Input register={register} name="name" errors={errors} />
      </form>
    </>
  )
}

test('should render Input with react-fook-form', () => {
  const {
    container: { firstChild },
  } = TestRenderer(<Form />)

  expect(firstChild).toBeTruthy()
})

test('should be able to input any text', () => {
  const { getByRole } = TestRenderer(<Form />)
  const input = getByRole('textbox')
  act(() => userEvent.type(input, 'Hello World!'))
  expect(input).toHaveValue('Hello World!')
})
