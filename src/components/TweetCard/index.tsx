import React, { type ComponentProps } from 'react'

import type { Tweet } from '@/validator'

interface Props {
  tweet: Tweet
}

export const TweetCard: React.FC<Props & ComponentProps<'div'>> = ({
  tweet,
  ...rest
}) => {
  return <div {...rest}>{tweet.text}</div>
}
