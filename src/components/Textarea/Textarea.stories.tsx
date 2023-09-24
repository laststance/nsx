import type { ComponentStory } from '@storybook/react'
import React from 'react'
import { useForm } from 'react-hook-form'

import Textarea from './Textarea'

export default {
  title: 'Components/Textarea',
  component: Textarea,
}

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

const Template: ComponentStory<typeof Textarea> = (props) => (
  <TextareaForm {...props} />
)

export const Default = Template.bind({})
