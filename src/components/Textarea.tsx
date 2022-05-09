import { ExclamationCircleIcon } from '@heroicons/react/solid'
import clsx from 'clsx'
import React, { memo } from 'react'
import type { TextareaHTMLAttributes } from 'react'

import type { ReactHookFormParams } from './Input'

interface Props {
  placeholder?: string
  reactHookFormParams: ReactHookFormParams
}

const styles = {
  basic:
    ' focus:bg-white focus:border-purple-500 leading-tight text-gray-700 bg-gray-200 border-2 border-gray-200 rounded appearance-none',
  error:
    'focus:ring-red-500 focus:border-red-500 sm:text-sm block pr-10 text-red-900 placeholder-red-300 border-red-300 rounded-md',
}

const Textarea: React.FC<
  React.PropsWithChildren<Props & TextareaHTMLAttributes<HTMLTextAreaElement>>
> = memo(
  ({
    placeholder,
    reactHookFormParams: { register, options, errors, name },
    ...rest
  }) => {
    const hasError: boolean = errors[name]
    return (
      <div>
        <div className="relative mt-1 rounded-md shadow-sm">
          <textarea
            {...register(name, options)}
            className={
              'focus:outline-none' +
              clsx(hasError && styles.error, !hasError && styles.basic)
            }
            placeholder={placeholder}
            data-cy="post-body-input"
            {...rest}
          />
          {hasError && (
            <div className="pointer-events-none absolute inset-y-2 right-0 flex items-start pr-3">
              <ExclamationCircleIcon
                className="h-5 w-5 text-red-500"
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
  }
)
Textarea.displayName = 'Textarea'

export default Textarea
