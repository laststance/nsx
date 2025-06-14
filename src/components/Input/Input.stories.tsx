import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'
import { useForm } from 'react-hook-form'

import Input from './Input'

const meta: Meta<typeof Input> = {
  title: 'Components/Input',
  component: Input,
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
      reactHookFormParams={{
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

// Error state story
const ErrorInputGroup: React.FC = () => {
  const {
    formState: { errors },
    register,
  } = useForm<formInputValue>()

  return (
    <Input
      type="text"
      placeholder="Required field"
      reactHookFormParams={{
        name: 'firstName',
        fieldError: { type: 'required', message: 'firstName is required' },
        options: { required: 'firstName is required' },
        register,
      }}
    />
  )
}

export const WithError: StoryObj<typeof meta> = {
  render: () => <ErrorInputGroup />,
}

// Email input story
const EmailInputGroup: React.FC = () => {
  const {
    formState: { errors },
    register,
  } = useForm<{ email: string }>()

  return (
    <Input
      type="email"
      placeholder="user@example.com"
      reactHookFormParams={{
        name: 'email',
        fieldError: errors['email'],
        options: {
          required: 'Email is required',
          pattern: {
            value: /^\S+@\S+$/i,
            message: 'Invalid email format',
          },
        },
        register,
      }}
    />
  )
}

export const EmailType: StoryObj<typeof meta> = {
  render: () => <EmailInputGroup />,
}

// Password input story
const PasswordInputGroup: React.FC = () => {
  const {
    formState: { errors },
    register,
  } = useForm<{ password: string }>()

  return (
    <Input
      type="password"
      placeholder="Enter password"
      reactHookFormParams={{
        name: 'password',
        fieldError: errors['password'],
        options: {
          required: 'Password is required',
          minLength: {
            value: 8,
            message: 'Password must be at least 8 characters',
          },
        },
        register,
      }}
    />
  )
}

export const PasswordType: StoryObj<typeof meta> = {
  render: () => <PasswordInputGroup />,
}
