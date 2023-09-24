import type { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import { useForm } from 'react-hook-form'

import Input from './Input'

const meta: ComponentMeta<typeof Input> = {
  title: 'Components/Input',
  component: Input,
}

export default meta

interface formInputValue {
  email: string
  firstName: string
  lastName: string
}

const InputGroup: React.FC = (props) => {
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
      {...props}
    />
  )
}

const Template: ComponentStory<typeof Input> = (props) => (
  <InputGroup {...props} />
)

export const TextInput = Template.bind({})
