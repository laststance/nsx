import { zodResolver } from '@hookform/resolvers/zod'
import userEvent from '@testing-library/user-event'
import React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod/v4'

import { bodySchema } from '../../../validator'
import TestRenderer from '../../lib/TestRenderer'

import Textarea from './Textarea'

interface FormInput {
  body: Post['body']
}

const formValidator = z.object({
  body: bodySchema,
})

interface Props {
  defaultValue?: string | number | readonly string[] | undefined
  handleSubmitMock?: AnyFunction
  placeholder?: string | undefined
}

const Form: React.FC<Props> = ({
  defaultValue = undefined,
  handleSubmitMock = vi.fn(),
  placeholder = undefined,
}) => {
  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<FormInput>({
    resolver: zodResolver(formValidator),
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
          name: 'body',
          fieldError: errors['body'],
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
