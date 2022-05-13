import { ExclamationCircleIcon } from '@heroicons/react/solid'
import clsx from 'clsx'
import type { InputHTMLAttributes, HTMLInputTypeAttribute } from 'react'
import React, { memo } from 'react'
import type {
  FormState,
  InternalFieldName,
  RegisterOptions,
} from 'react-hook-form'
import type { UseFormRegister } from 'react-hook-form/dist/types/form'

// All form Component depends on library that https://github.com/react-hook-form/react-hook-form
export interface ReactHookFormParams {
  register: UseFormRegister<_>
  name: InternalFieldName
  errors: FormState<any>['errors']
  options?: RegisterOptions
}

interface Props {
  type?: HTMLInputTypeAttribute
  defaultValue?: string | number | readonly string[] | undefined
  placeholder?: string
  reactHookFormPrams: ReactHookFormParams
}

const styles = {
  basic:
    ' focus:bg-white focus:border-purple-500 w-full px-4 py-2 leading-tight text-gray-700 bg-gray-200 border-2 border-gray-200 rounded appearance-none',
  error:
    'focus:ring-red-500 focus:border-red-500 sm:text-sm block w-full pr-10 text-red-900 placeholder-red-300 border-red-300 rounded-md',
}

const Input: React.FC<
  React.PropsWithChildren<Props & InputHTMLAttributes<HTMLInputElement>>
> = memo(
  ({
    type,
    placeholder,
    reactHookFormPrams: { register, options, name, errors },
    ...rest
  }) => {
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
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <ExclamationCircleIcon
                className="h-5 w-5 text-red-500"
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
  }
)
Input.displayName = 'Input'

export default Input
