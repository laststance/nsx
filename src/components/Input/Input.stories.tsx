import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { useForm } from 'react-hook-form'

import Input from './Input'

const meta: Meta<typeof Input> = {
  title: 'Components/Input',
  component: Input,
  tags: ['autodocs'],
}

export default meta

interface formInputValue {
  email: string
  firstName: string
  lastName: string
}

const InputGroup: React.FC = () => {
  const {
    formState: { errors },
    register,
  } = useForm<formInputValue>()

  return (
    <Input
      type="text"
      placeholder="Emily"
      reactHookFormPrams={{
        name: 'firstName',
        fieldError: errors['firstName'],
        options: { required: 'firstName is required' },
        register,
      }}
    />
  )
}

export const Default: StoryObj<typeof meta> = {
  render: () => <InputGroup />,
}
