import { superstructResolver } from '@hookform/resolvers/superstruct'
import userEvent from '@testing-library/user-event'
import React from 'react'
import { useForm } from 'react-hook-form'
import { object } from 'superstruct'

import { body } from '../../../validator'
import TestRenderer from '../../lib/TestRenderer'

import Textarea from './Textarea'

interface FormInput {
  body: Post['body']
}

const formValidator = object({
  body: body,
})

interface Props {
  handleSubmitMock?: AnyFunction
  defaultValue?: string | number | readonly string[] | undefined
  placeholder?: string | undefined
}

const Form: React.FC<Props> = ({
  handleSubmitMock = vi.fn(),
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
    <form
      area-label="Textarea Testing Form"
      onSubmit={handleSubmit(handleSubmitMock)}
    >
      <Textarea
        defaultValue={defaultValue}
        placeholder={placeholder}
        reactHookFormParams={{
          fieldError: errors['body'],
          name: 'body',
          register,
        }}
      />
      <button type="submit">testing submit button</button>
    </form>
  )
}

test('should render Textarea with react-fook-form', () => {
  const {
    container: { firstChild },
  } = TestRenderer(<Form />)

  expect(firstChild).toBeTruthy()
})

test('should be able to input any text', async () => {
  const user = userEvent.setup()
  const handleSubmit = vi.fn((data) => {
    return data
  })

  const { getByRole } = TestRenderer(<Form handleSubmitMock={handleSubmit} />)

  const textarea = getByRole('textbox')
  await user.type(textarea, 'Hello Textarea!')
  const submitBtn = getByRole('button')
  await user.click(submitBtn)

  expect(handleSubmit).toHaveBeenCalled()
  expect(handleSubmit).toHaveReturnedWith({ body: 'Hello Textarea!' })
})
