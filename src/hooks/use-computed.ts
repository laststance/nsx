import { useState } from 'react'

import { useIsoMorphicEffect } from './use-iso-morphic-effect'
import { useLatestValue } from './use-latest-value'

export function useComputed<T>(
  cb: () => T,
  dependencies: React.DependencyList
) {
  const [value, setValue] = useState(cb)
  const cbRef = useLatestValue(cb)
  useIsoMorphicEffect(
    () => setValue(cbRef.current),
    [cbRef, setValue, ...dependencies]
  )
  return value
}
