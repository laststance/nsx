import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { useForm } from 'react-hook-form'

import Textarea from './Textarea'

const meta = {
  title: 'Components/Textarea',
  component: Textarea,
  tags: ['autodocs'],
} satisfies Meta<typeof Textarea>
export default meta
type Story = StoryObj<typeof meta>
interface FormInput {
  message: string
}

const TextareaForm = () => {
  const {
    formState: { errors },
    register,
  } = useForm<FormInput>()
  return (
    <Textarea
      name="message"
      reactHookFormParams={{
        name: 'message',
        fieldError: errors['message'],
        options: { required: 'message is required' },
        register,
      }}
      placeholder="Type any text"
    />
  )
}

// @ts-expect-error wrapped original component for pass hookForm parameters
export const Default: Story = (props) => <TextareaForm {...props} />
