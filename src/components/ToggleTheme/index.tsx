import clsx from 'clsx'
import React, { memo, useEffect, useRef, useState } from 'react'

import type { Theme } from '../../redux/themeSlice'

import MoonIcon from './MoonIcon'
import PcIcon from './PCIcon'
import SunIcon from './SunIcon'
import { useTheme } from './useTheme'

const THEME_MENU_OPTIONS_ID = 'theme-menu-options'

interface ThemeOption {
  icon: typeof SunIcon
  label: string
  value: Theme
}

const options: ThemeOption[] = [
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

/**
 * Renders the theme picker without Headless UI while keeping the existing E2E selectors stable.
 * @returns A button-triggered listbox for selecting light, dark, or system theme.
 * @example
 * <ThemeToggle />
 */
const ThemeToggle = memo(() => {
  const [theme, updateTheme] = useTheme()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    // Skip the document listener while closed so normal page clicks stay untouched.
    if (!isMenuOpen) return undefined

    const handleDocumentMouseDown = (event: MouseEvent) => {
      const targetNode = event.target

      // Clicking inside the menu should not close it before the option handler runs.
      if (targetNode instanceof Node && rootRef.current?.contains(targetNode)) {
        return
      }

      setIsMenuOpen(false)
    }

    document.addEventListener('mousedown', handleDocumentMouseDown)

    return () => {
      document.removeEventListener('mousedown', handleDocumentMouseDown)
    }
  }, [isMenuOpen])

  const handleThemeSelect = (nextTheme: Theme) => {
    updateTheme(nextTheme)
    setIsMenuOpen(false)
    buttonRef.current?.focus()
  }

  const handleMenuKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    // Escape mirrors native select dismissal and returns focus to the trigger.
    if (event.key === 'Escape') {
      setIsMenuOpen(false)
      buttonRef.current?.focus()
    }
  }

  return (
    <div ref={rootRef} onKeyDown={handleMenuKeyDown}>
      <span className="sr-only" id="theme-menu-label">
        Theme
      </span>
      <div className="relative">
        <button
          ref={buttonRef}
          aria-controls={THEME_MENU_OPTIONS_ID}
          aria-expanded={isMenuOpen}
          aria-haspopup="listbox"
          aria-labelledby="theme-menu-label"
          type="button"
          data-testid="theme-menu-button"
          onClick={() => {
            setIsMenuOpen((currentIsMenuOpen) => !currentIsMenuOpen)
          }}
        >
          <span className="dark:hidden">
            <SunIcon className="h-6 w-6" selected={theme !== 'system'} />
          </span>
          <span className="hidden dark:inline">
            <MoonIcon className="h-6 w-6" selected={theme !== 'system'} />
          </span>
        </button>
        {isMenuOpen && (
          <div
            aria-labelledby="theme-menu-label"
            className="dark:highlight-white/5 absolute top-5 -right-16 z-50 mt-4 w-36 overflow-hidden rounded-lg bg-white py-1 text-sm font-semibold text-slate-700 shadow-lg ring-1 ring-slate-900/10 dark:bg-neutral-700 dark:text-slate-300 dark:ring-0"
            id={THEME_MENU_OPTIONS_ID}
            role="listbox"
          >
            {options.map(({ icon: Icon, label, value }) => {
              const isSelected = theme === value

              return (
                <button
                  key={value}
                  aria-selected={isSelected}
                  className={clsx(
                    'flex w-full cursor-pointer items-center px-2 py-1 text-left',
                    'hover:bg-slate-50 focus:bg-slate-50 focus:outline-hidden dark:hover:bg-slate-600/30 dark:focus:bg-slate-600/30',
                    isSelected && 'text-green-400',
                  )}
                  data-testid={`theme-select-option-${value}`}
                  role="option"
                  type="button"
                  onClick={() => {
                    handleThemeSelect(value)
                  }}
                >
                  <Icon selected={isSelected} className="mr-2 h-6 w-6" />
                  {label}
                </button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
})
ThemeToggle.displayName = 'ThemeToggle'

export default ThemeToggle
