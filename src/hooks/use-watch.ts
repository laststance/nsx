import { useEffect, useRef } from 'react'

import { useEvent } from './use-event'

export function useWatch<T>(
  cb: (values: T[]) => void | (() => void),
  dependencies: T[]
) {
  const track = useRef<typeof dependencies>([])
  const action = useEvent(cb)

  useEffect(() => {
    for (const [idx, value] of dependencies.entries()) {
      if (track.current[idx] !== value) {
        // At least 1 item changed
        const returnValue = action(dependencies)
        track.current = dependencies
        return returnValue
      }
    }
  }, [action, ...dependencies])
}
