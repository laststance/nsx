import { ExclamationCircleIcon } from '@heroicons/react/solid'
import clsx from 'clsx'
import type { InputHTMLAttributes, HTMLInputTypeAttribute } from 'react'
import React, { memo } from 'react'
import type {
  FormState,
  InternalFieldName,
  RegisterOptions,
} from 'react-hook-form'

interface Props {
  type?: HTMLInputTypeAttribute
  register: AnyFunction
  options?: RegisterOptions
  name: InternalFieldName
  errors: FormState<any>['errors']
  placeholder?: string
}

const styles = {
  basic:
    ' focus:bg-white focus:border-purple-500 w-full px-4 py-2 leading-tight text-gray-700 bg-gray-200 border-2 border-gray-200 rounded appearance-none',
  error:
    'focus:ring-red-500 focus:border-red-500 sm:text-sm block w-full pr-10 text-red-900 placeholder-red-300 border-red-300 rounded-md',
}

const Input: React.FC<
  React.PropsWithChildren<Props & InputHTMLAttributes<HTMLInputElement>>
> = memo(({ type, register, options, name, errors, placeholder, ...rest }) => {
  const hasError: boolean = errors[name]
  return (
    <div>
      <div className="relative mt-1 rounded-md shadow-sm">
        <input
          type={type ? type : 'text'}
          {...register(name, options)}
          className={
            'focus:outline-none ' +
            clsx(hasError && styles.error, !hasError && styles.basic)
          }
          placeholder={placeholder}
          {...rest}
        />

        {hasError && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <ExclamationCircleIcon
              className="w-5 h-5 text-red-500"
              aria-hidden="true"
            />
          </div>
        )}
      </div>
      {hasError && (
        <p className="mt-2 text-sm text-red-600">{errors[name]?.message}</p>
      )}
    </div>
  )
})
Input.displayName = 'Input'

export default Input
