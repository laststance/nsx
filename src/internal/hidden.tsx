import type { ElementType, Ref } from 'react'

import type { Props } from '../types'
import { forwardRefWithAs, render } from '../utils/render'

const DEFAULT_VISUALLY_HIDDEN_TAG = 'div' as const

export enum Features {
  // The default, no features.
  None = 1 << 0,

  // Whether the element should be focusable or not.
  Focusable = 1 << 1,

  // Whether it should be completely hidden, even to assistive technologies.
  Hidden = 1 << 2,
}

export const Hidden = forwardRefWithAs(function VisuallyHidden<
  TTag extends ElementType = typeof DEFAULT_VISUALLY_HIDDEN_TAG
>(props: Props<TTag> & { features?: Features }, ref: Ref<HTMLElement>) {
  const { features = Features.None, ...theirProps } = props
  const ourProps = {
    'aria-hidden':
      (features & Features.Focusable) === Features.Focusable ? true : undefined,
    ref,
    style: {
      borderWidth: '0',
      clip: 'rect(0, 0, 0, 0)',
      height: 1,
      margin: -1,
      overflow: 'hidden',
      padding: 0,
      position: 'absolute',
      whiteSpace: 'nowrap',
      width: 1,
      ...((features & Features.Hidden) === Features.Hidden &&
        !((features & Features.Focusable) === Features.Focusable) && {
          display: 'none',
        }),
    },
  }

  return render({
    defaultTag: DEFAULT_VISUALLY_HIDDEN_TAG,
    name: 'Hidden',
    ourProps,
    slot: {},
    theirProps,
  })
})
