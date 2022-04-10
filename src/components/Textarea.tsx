import { ExclamationCircleIcon } from '@heroicons/react/solid'
import clsx from 'clsx'
import React, { memo } from 'react'
import type { TextareaHTMLAttributes } from 'react'
import type {
  RegisterOptions,
  InternalFieldName,
  FormState,
} from 'react-hook-form'

import { handleBodyChange } from '../pages/Create/handlers'

interface Props {
  register: AnyFunction
  options?: RegisterOptions
  name: InternalFieldName
  errors: FormState<any>['errors']
  placeholder?: string
}

const styles = {
  basic:
    ' focus:bg-white focus:border-purple-500 leading-tight text-gray-700 bg-gray-200 border-2 border-gray-200 rounded appearance-none',
  error:
    'focus:ring-red-500 focus:border-red-500 sm:text-sm block pr-10 text-red-900 placeholder-red-300 border-red-300 rounded-md',
}

const Textarea: React.FC<
  React.PropsWithChildren<Props & TextareaHTMLAttributes<HTMLTextAreaElement>>
> = memo(({ register, options, name, errors, placeholder, ...rest }) => {
  const hasError: boolean = errors[name]
  return (
    <div>
      <div className="relative mt-1 rounded-md shadow-sm">
        <textarea
          {...register(name, options)}
          className={
            'focus:outline-none h-60 w-full mt-3' +
            clsx(hasError && styles.error, !hasError && styles.basic)
          }
          onChange={handleBodyChange}
          placeholder={placeholder}
          data-cy="post-body-input"
          {...rest}
        />
        {hasError && (
          <div className="inset-y-2 absolute right-0 flex items-start pr-3 pointer-events-none">
            <ExclamationCircleIcon
              className="w-5 h-5 text-red-500"
              aria-hidden="true"
            />
          </div>
        )}
        {hasError && (
          <p className="mt-2 text-sm text-red-600">{errors[name]?.message}</p>
        )}
      </div>
    </div>
  )
})
Textarea.displayName = 'Textarea'

export default Textarea
