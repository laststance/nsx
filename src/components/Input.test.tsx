import { superstructResolver } from '@hookform/resolvers/superstruct'
import React from 'react'
import { useForm } from 'react-hook-form'
import { object } from 'superstruct'

import { name } from '../../validator/index'
import TestRenderer from '../lib/TestRenderer'

import Input from './Input'

interface FormInput {
  name: Author['name']
}

const formValidator = object({
  name: name,
})

const Form = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInput>({
    resolver: superstructResolver(formValidator),
  })

  return (
    <>
      <form onSubmit={handleSubmit(() => {})}>
        <Input register={register} name="name" errors={errors} />
      </form>
    </>
  )
}

test('should render Input with react-fook-form', () => {
  const {
    container: { firstChild },
  } = TestRenderer(<Form />)
  expect(firstChild).toBeTruthy()
})
