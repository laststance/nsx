import type { ComponentMeta, ComponentStory } from '@storybook/react'
import React, { memo } from 'react'
import { useForm } from 'react-hook-form'

import Input from './Input'

const meta: ComponentMeta<typeof Input> = {
  title: 'Components/Input',
  component: Input,
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
      register={register}
      options={{ required: 'firstName is required' }}
      name="firstName"
      errors={errors}
      placeholder="Emily"
      {...props}
    />
  )
})

const Template: ComponentStory<typeof Input> = (props) => (
  <InputGroup {...props} />
)

export const TextInput = Template.bind({})
