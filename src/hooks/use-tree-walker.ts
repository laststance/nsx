import { useRef, useEffect } from 'react'

import { getOwnerDocument } from '../utils/owner'

import { useIsoMorphicEffect } from './use-iso-morphic-effect'

type AcceptNode = (
  node: HTMLElement
) =>
  | typeof NodeFilter.FILTER_ACCEPT
  | typeof NodeFilter.FILTER_SKIP
  | typeof NodeFilter.FILTER_REJECT

export function useTreeWalker({
  container,
  accept,
  walk,
  enabled = true,
}: {
  container: HTMLElement | null
  accept: AcceptNode
  walk(node: HTMLElement): void
  enabled?: boolean
}) {
  const acceptRef = useRef(accept)
  const walkRef = useRef(walk)

  useEffect(() => {
    acceptRef.current = accept
    walkRef.current = walk
  }, [accept, walk])

  useIsoMorphicEffect(() => {
    if (!container) return
    if (!enabled) return
    const ownerDocument = getOwnerDocument(container)
    if (!ownerDocument) return

    const accept = acceptRef.current
    const walk = walkRef.current

    const acceptNode = Object.assign((node: HTMLElement) => accept(node), {
      acceptNode: accept,
    })
    const walker = ownerDocument.createTreeWalker(
      container,
      NodeFilter.SHOW_ELEMENT,
      acceptNode,
      // @ts-expect-error This `false` is a simple small fix for older browsers
      false
    )

    while (walker.nextNode()) walk(walker.currentNode as HTMLElement)
  }, [container, enabled, acceptRef, walkRef])
}
