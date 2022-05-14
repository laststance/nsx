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

interface Props {
  handleSubmitMock?: AnyFunction
  defaultValue?: string | number | readonly string[] | undefined
  placeholder?: string | undefined
}

const Form: React.FC<Props> = ({
  handleSubmitMock = jest.fn(),
  defaultValue = undefined,
  placeholder = undefined,
}) => {
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
        <Input
          placeholder={placeholder}
          defaultValue={defaultValue}
          reactHookFormPrams={{ errors, name: 'name', register }}
        />
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

test('should apply default value props', () => {
  const { getByRole } = TestRenderer(<Form defaultValue="MSC" />)
  const input = getByRole('textbox')
  expect(input).toHaveValue('MSC')
})

test('should apply placefolder props', () => {
  const { getByPlaceholderText } = TestRenderer(
    <Form placeholder="let type something" defaultValue="long train" />
  )
  const input = getByPlaceholderText('let type something')
  expect(input).toHaveValue('long train')
})

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
