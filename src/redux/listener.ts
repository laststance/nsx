import type { Theme } from './themeSlice'

export function SwitchLightAndDarkTheme(theme: Theme) {
  if (
    theme === 'dark' ||
    (theme === 'system' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches)
  ) {
    document.documentElement.classList.add('dark', 'changing-theme')
  } else {
    document.documentElement.classList.remove('dark', 'changing-theme')
  }
  window.setTimeout(() => {
    document.documentElement.classList.remove('changing-theme')
  })
}
