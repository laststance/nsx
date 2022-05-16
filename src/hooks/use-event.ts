import React from 'react'

export const useEvent =
  // TODO: Add React.useEvent ?? once the useEvent hook is available
  function useEvent<T, R>(cb: (...args: T[]) => R) {
    const cache = React.useRef(cb)
    cache.current = cb
    return React.useCallback((...args: T[]) => cache.current(...args), [cache])
  }
