import { superstructResolver } from '@hookform/resolvers/superstruct'
import userEvent from '@testing-library/user-event'
import React from 'react'
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

const Form = ({ handleSubmitMock = jest.fn() }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInput>({
    resolver: superstructResolver(formValidator),
  })

  return (
    <>
      <form onSubmit={handleSubmit(handleSubmitMock)}>
        <Input reactHookFormPrams={{ errors, name: 'name', register }} />
        <button type="submit">submit</button>
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

test.todo('should apply default value props')

test.todo('should apply placefolder props')

test.todo('shold apply type props')

test('should be able to input any text', async () => {
  const user = userEvent.setup()
  const { getByRole } = TestRenderer(<Form />)
  const input = getByRole('textbox')
  await user.type(input, 'Hello World!')
  expect(input).toHaveValue('Hello World!')
})

test('should submit input text when onSubmit fired', async () => {
  const user = userEvent.setup()
  const handleSubmit = jest.fn((data) => {
    return data
  })

  const { getByRole } = TestRenderer(<Form handleSubmitMock={handleSubmit} />)

  const input = getByRole('textbox')
  await user.type(input, 'Hello World!')
  const submitBtn = getByRole('button')
  await user.click(submitBtn)

  expect(handleSubmit).toHaveBeenCalled()
  expect(handleSubmit).toHaveReturnedWith({ name: 'Hello World!' })
})

test.todo('should show error message with invalid input')
