import React, { type ComponentProps } from 'react'

import type { Tweet } from '@/validator'

interface Props {
  tweet: Tweet
}
// TODO: Apply TailwindCSS
export const TweetCard: React.FC<Props & ComponentProps<'div'>> = ({
  tweet,
  ...rest
}) => {
  return (
    <div
      {...rest}
      data-testid={`tweet-card-${tweet.id}`}
      className="rounded-md border border-gray-200 p-4 dark:border-gray-700 dark:text-white"
    >
      {tweet.text}
    </div>
  )
}
