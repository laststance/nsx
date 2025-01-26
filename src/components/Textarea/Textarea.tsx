import { ExclamationCircleIcon } from '@heroicons/react/24/solid'
import clsx from 'clsx'
import React, { memo } from 'react'
import type { TextareaHTMLAttributes } from 'react'

import type { ReactHookFormParams } from '../Input/Input'
import { stopPropagation } from '../Input/Input'

interface Props {
  defaultValue?: string | number | readonly string[] | undefined
  placeholder?: string
  reactHookFormParams: ReactHookFormParams
  value?: string | number | readonly string[] | undefined
}

const styles = {
  basic:
    'focus:bg-white focus:border-purple-500 leading-tight text-gray-700 bg-gray-200 border-2 border-gray-200 rounded-sm appearance-none',
  error:
    'focus:ring-red-500 focus:border-red-500 sm:text-sm block pr-10 text-red-900 placeholder-red-300 border-red-300 rounded-md',
}

const Textarea: React.FC<
  React.PropsWithChildren<Props & TextareaHTMLAttributes<HTMLTextAreaElement>>
> = memo(
  ({
    defaultValue,
    placeholder,
    reactHookFormParams: { name, fieldError, options, register },
    value,
    ...rest
  }) => {
    return (
      <div>
        <div className="relative mt-1 rounded-md shadow-xs">
          <textarea
            value={value}
            defaultValue={defaultValue}
            {...register(name, options)}
            className={
              'focus:outline-hidden' +
              clsx(fieldError && styles.error, !fieldError && styles.basic)
            }
            placeholder={placeholder}
            data-testid="post-body-input"
            onKeyUp={stopPropagation}
            {...rest}
          />
          {fieldError && (
            <div className="pointer-events-none absolute inset-y-2 right-0 flex items-start pr-3">
              <ExclamationCircleIcon
                className="h-5 w-5 text-red-500"
                aria-hidden="true"
              />
            </div>
          )}
          {fieldError && (
            <p className="mt-2 text-sm text-red-600">{fieldError.message}</p>
          )}
        </div>
      </div>
    )
  },
)
Textarea.displayName = 'Textarea'

export default Textarea
