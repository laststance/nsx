import type { ComponentProps } from 'react'
import React, { memo } from 'react'

interface Props {
  selected: boolean
}

const SunIcon = memo(
  ({ selected, ...props }: Props & ComponentProps<'svg'>) => {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
      >
        <path
          d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
          className={
            selected
              ? 'fill-neutral-400 stroke-slate-500'
              : 'stroke-neutral-400 dark:stroke-slate-500'
          }
        />
        <path
          d="M12 4v1M17.66 6.344l-.828.828M20.005 12.004h-1M17.66 17.664l-.828-.828M12 20.01V19M6.34 17.664l.835-.836M3.995 12.004h1.01M6 6l.835.836"
          className={
            selected
              ? 'stroke-neutral-400'
              : 'stroke-slate-400 dark:stroke-slate-500'
          }
        />
      </svg>
    )
  }
)
SunIcon.displayName = 'SunIcon'

export default SunIcon
