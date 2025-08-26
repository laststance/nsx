import { X } from 'lucide-react'
import React, { type ComponentProps } from 'react'

import type { Tweet } from '@/validator'

interface Props {
  tweet: Tweet
  onDelete?: (id: number) => void
}
export const TweetCard: React.FC<Props & ComponentProps<'div'>> = ({
  tweet,
  onDelete,
  ...rest
}) => {
  return (
    <div
      {...rest}
      data-testid={`tweet-card-${tweet.id}`}
      className="relative rounded-md border border-gray-200 p-4 dark:border-gray-700 dark:text-white"
    >
      {onDelete && (
        <button
          onClick={() => onDelete(tweet.id)}
          className="absolute top-2 right-2 rounded-full p-1 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
          data-testid={`delete-tweet-${tweet.id}`}
          aria-label={`Delete tweet ${tweet.id}`}
        >
          <X className="h-4 w-4 text-gray-500 hover:text-red-500" />
        </button>
      )}
      {tweet.text}
    </div>
  )
}
