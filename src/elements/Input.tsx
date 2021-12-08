import { ExclamationCircleIcon } from '@heroicons/react/solid'
import type { InputHTMLAttributes } from 'react'
import React, { memo } from 'react'
import type { InternalFieldName, UseFormReturn } from 'react-hook-form'

interface Props {
  register: UseFormReturn['register']
  name: InternalFieldName
  formState: UseFormReturn['formState']
}
const styles = {
  basic:
    ']focus:outline-none focus:bg-white focus:border-purple-500 w-full px-4 py-2 leading-tight text-gray-700 bg-gray-200 border-2 border-gray-200 rounded appearance-none',
  error:
    'focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm block w-full pr-10 text-red-900 placeholder-red-300 border-red-300 rounded-md',
}

const Input: React.FC<Props & InputHTMLAttributes<HTMLInputElement>> = memo(
  ({ register, name, formState: { errors }, ...rest }) => {
    const hasError = errors[name]
    return (
      <div className="relative mt-1 rounded-md shadow-sm">
        <input
          {...register(name, { required: true, minLength: 6 })}
          aria-invalid="true"
          aria-describedby="email-error"
          className={hasError ? styles.error : styles.basic}
          {...rest}
        />
        {hasError && (
          <>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <ExclamationCircleIcon
                className="w-5 h-5 text-red-500"
                aria-hidden="true"
              />
            </div>
            <p className="mt-2 text-sm text-red-600" id="email-error">
              Your password must be less than 4 characters.
            </p>
          </>
        )}
      </div>
    )
  }
)

export default Input
