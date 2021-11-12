import type { AdminState } from '../redux/adminSlice'

interface LocalStorageData {
  login: AdminState['login']
  author: AdminState['author']
}

export const LocalStorage = {
  setItem: (
    key: keyof LocalStorageData,
    value: AdminState['login'] | AdminState['author']
  ): void => window.localStorage.setItem(key, JSON.stringify(value)),
  getItem: (
    key: keyof LocalStorageData
  ): AdminState['login'] | AdminState['author'] | null =>
    JSON.parse(window.localStorage.getItem(key) as string),
}
