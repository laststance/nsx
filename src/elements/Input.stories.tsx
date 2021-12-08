import type { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import { useForm } from 'react-hook-form'

import Input from './Input'

const meta: ComponentMeta<typeof Input> = {
  title: 'Elements/Input',
  component: Input,
}

export default meta

interface formInputValue {
  text: string
}

const InputGroup = () => {
  const { register, formState } = useForm<formInputValue>()

  return (
    // @ts-ignore
    <Input register={register} name="text" formState={formState} />
  )
}

// @ts-ignore
const Template: ComponentStory<typeof Input> = (props) => (
  <InputGroup {...props} />
)

export const Primary = Template.bind({})
