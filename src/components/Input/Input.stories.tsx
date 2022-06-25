import type { ComponentMeta, ComponentStory } from '@storybook/react'
import React, { memo } from 'react'
import { useForm } from 'react-hook-form'

import Input from './Input'

const meta: ComponentMeta<typeof Input> = {
  component: Input,
  title: 'Components/Input',
}

export default meta

interface formInputValue {
  firstName: string
  lastName: string
  email: string
}

const InputGroup: React.FC = memo((props) => {
  const {
    register,
    formState: { errors },
  } = useForm<formInputValue>()

  return (
    <Input
      type="text"
      placeholder="Emily"
      reactHookFormPrams={{
        fieldError: errors['firstName'],
        name: 'firstName',
        options: { required: 'firstName is required' },
        register,
      }}
      {...props}
    />
  )
})

const Template: ComponentStory<typeof Input> = (props) => (
  <InputGroup {...props} />
)

export const TextInput = Template.bind({})
