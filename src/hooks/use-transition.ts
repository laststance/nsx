import type { MutableRefObject } from 'react'

import { Reason, transition } from '../components/transitions/utils/transition'
import { disposables } from '../utils/disposables'
import { match } from '../utils/match'

import { useDisposables } from './use-disposables'
import { useEvent } from './use-event'
import { useIsMounted } from './use-is-mounted'
import { useIsoMorphicEffect } from './use-iso-morphic-effect'
import { useLatestValue } from './use-latest-value'

interface TransitionArgs {
  container: MutableRefObject<HTMLElement | null>
  classes: MutableRefObject<{
    enter: string[]
    enterFrom: string[]
    enterTo: string[]

    leave: string[]
    leaveFrom: string[]
    leaveTo: string[]

    entered: string[]
  }>
  events: MutableRefObject<{
    beforeEnter: () => void
    afterEnter: () => void
    beforeLeave: () => void
    afterLeave: () => void
  }>
  direction: 'enter' | 'leave' | 'idle'
  onStart: MutableRefObject<(direction: TransitionArgs['direction']) => void>
  onStop: MutableRefObject<(direction: TransitionArgs['direction']) => void>
}

export function useTransition({
  container,
  direction,
  classes,
  events,
  onStart,
  onStop,
}: TransitionArgs) {
  const mounted = useIsMounted()
  const d = useDisposables()

  const latestDirection = useLatestValue(direction)

  const beforeEvent = useEvent(() => {
    return match(latestDirection.current, {
      enter: () => events.current.beforeEnter(),
      idle: () => {},
      leave: () => events.current.beforeLeave(),
    })
  })

  const afterEvent = useEvent(() => {
    return match(latestDirection.current, {
      enter: () => events.current.afterEnter(),
      idle: () => {},
      leave: () => events.current.afterLeave(),
    })
  })

  useIsoMorphicEffect(() => {
    const dd = disposables()
    d.add(dd.dispose)

    const node = container.current
    if (!node) return // We don't have a DOM node (yet)
    if (latestDirection.current === 'idle') return // We don't need to transition
    if (!mounted.current) return

    dd.dispose()

    beforeEvent()

    onStart.current(latestDirection.current)

    dd.add(
      transition(
        node,
        classes.current,
        latestDirection.current === 'enter',
        (reason) => {
          dd.dispose()

          match(reason, {
            [Reason.Ended]() {
              afterEvent()
              onStop.current(latestDirection.current)
            },
            [Reason.Cancelled]: () => {},
          })
        }
      )
    )

    return dd.dispose
  }, [direction])
}
