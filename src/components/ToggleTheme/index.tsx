import { Listbox } from '@headlessui/react'
import clsx from 'clsx'
import React, { Fragment } from 'react'

import { MoonIcon } from './MoonIcon'
import { SunIcon } from './SunIcon'
import { useTheme, settings } from './useTheme'

export function ThemeToggle({ panelClassName = 'mt-4' }) {
  const [setting, setSetting] = useTheme()

  return (
    // @ts-ignore onChange={setSetting}
    <Listbox value={setting} onChange={setSetting}>
      <Listbox.Label className="sr-only">Theme</Listbox.Label>
      <div className="relative">
        <Listbox.Button type="button">
          <span className="dark:hidden">
            <SunIcon className="h-6 w-6" selected={setting !== 'system'} />
          </span>
          <span className="hidden dark:inline">
            <MoonIcon className="h-6 w-6" selected={setting !== 'system'} />
          </span>
        </Listbox.Button>
        <Listbox.Options
          className={clsx(
            'dark:highlight-white/5 absolute top-5 -right-16 z-50 w-36 overflow-hidden rounded-lg bg-white py-1 text-sm font-semibold text-slate-700 shadow-lg ring-1 ring-slate-900/10 dark:bg-neutral-700 dark:text-slate-300 dark:ring-0',
            panelClassName
          )}
        >
          {settings.map(({ value, label, icon: Icon }) => (
            <Listbox.Option key={value} value={value} as={Fragment}>
              {({ active, selected }) => (
                <li
                  className={clsx(
                    'flex cursor-pointer items-center py-1 px-2',
                    selected && 'text-green-400',
                    active && 'bg-slate-50 dark:bg-slate-600/30'
                  )}
                >
                  <Icon selected={selected} className="mr-2 h-6 w-6" />
                  {label}
                </li>
              )}
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </div>
    </Listbox>
  )
}
