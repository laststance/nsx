import useDidUpdateEffect from './useDidUpdateEffect'
import useDidUpdateLayoutEffect from './useDidUpdateLayoutEffect'

export const useIsomorphicDidUpdateLayoutEffect =
  typeof window !== 'undefined' ? useDidUpdateLayoutEffect : useDidUpdateEffect
