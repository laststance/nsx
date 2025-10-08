import { Listbox } from '@headlessui/react'
import clsx from 'clsx'
import React, { memo } from 'react'

import MoonIcon from './MoonIcon'
import PcIcon from './PCIcon'
import SunIcon from './SunIcon'
import { useTheme } from './useTheme'

const options = [
  {
    icon: SunIcon,
    label: 'Light',
    value: 'light',
  },
  {
    icon: MoonIcon,
    label: 'Dark',
    value: 'dark',
  },
  {
    icon: PcIcon,
    label: 'System',
    value: 'system',
  },
]

// @TODO Extract from leadless UI
Listbox.displayName = 'Listbox'
Listbox.Label.displayName = 'Listbox.Label'
Listbox.Button.displayName = 'Listbox.Button'
Listbox.Options.displayName = 'Listbox.Options'
Listbox.Option.displayName = 'Listbox.Option'

const ThemeToggle = memo(() => {
  const [theme, updateTheme] = useTheme()

  return (
    <Listbox as="div" value={theme} onChange={updateTheme}>
      <Listbox.Label className="sr-only">Theme</Listbox.Label>
      <div className="relative">
        <Listbox.Button type="button" data-testid="theme-menu-button">
          <span className="dark:hidden">
            <SunIcon className="h-6 w-6" selected={theme !== 'system'} />
          </span>
          <span className="hidden dark:inline">
            <MoonIcon className="h-6 w-6" selected={theme !== 'system'} />
          </span>
        </Listbox.Button>
        <Listbox.Options className="dark:highlight-white/5 absolute top-5 -right-16 z-50 mt-4 w-36 overflow-hidden rounded-lg bg-white py-1 text-sm font-semibold text-slate-700 shadow-lg ring-1 ring-slate-900/10 dark:bg-neutral-700 dark:text-slate-300 dark:ring-0">
          {options.map(({ icon: Icon, label, value }) => (
            <Listbox.Option
              key={value}
              value={value}
              className={clsx(
                'flex cursor-pointer items-center px-2 py-1',
                'data-[headlessui-state~="active"]:bg-slate-50 data-[headlessui-state~="active"]:dark:bg-slate-600/30',
                'data-[headlessui-state~="selected"]:text-green-400',
              )}
              data-testid={`theme-select-option-${value}`}
            >
              {({ selected }) => (
                <>
                  <Icon selected={selected} className="mr-2 h-6 w-6" />
                  {label}
                </>
              )}
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </div>
    </Listbox>
  )
})
ThemeToggle.displayName = 'ThemeToggle'

export default ThemeToggle
