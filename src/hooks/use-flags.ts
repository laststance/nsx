import { useState, useCallback } from 'react'

export function useFlags(initialFlags = 0) {
  const [flags, setFlags] = useState(initialFlags)

  const addFlag = useCallback(
    (flag: number) => setFlags((flags) => flags | flag),
    [setFlags]
  )
  const hasFlag = useCallback((flag: number) => Boolean(flags & flag), [flags])
  const removeFlag = useCallback(
    (flag: number) => setFlags((flags) => flags & ~flag),
    [setFlags]
  )
  const toggleFlag = useCallback(
    (flag: number) => setFlags((flags) => flags ^ flag),
    [setFlags]
  )

  return { addFlag, hasFlag, removeFlag, toggleFlag }
}
