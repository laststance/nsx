import type { ComponentStory } from '@storybook/react'
import React from 'react'
import { useForm } from 'react-hook-form'

import Textarea from './Textarea'

export default {
  component: Textarea,
  title: 'Components/Textarea',
}

interface FormInput {
  message: string
}

const TextareaForm = () => {
  const {
    register,
    formState: { errors },
  } = useForm<FormInput>()
  return (
    <Textarea
      name="message"
      reactHookFormParams={{
        fieldError: errors['message'],
        name: 'message',
        options: { required: 'message is required' },
        register,
      }}
      placeholder="Type any text"
    />
  )
}

const Template: ComponentStory<typeof Textarea> = (props) => (
  <TextareaForm {...props} />
)

export const Default = Template.bind({})
