import { X } from 'lucide-react'
import React, { type ComponentProps } from 'react'

import { useDeleteTweetMutation } from '@/src/redux/API'
import { enqueSnackbar } from '@/src/redux/snackbarSlice'
import { dispatch } from '@/src/redux/store'
import type { Tweet } from '@/validator'

interface Props {
  tweet: Tweet
}
export const TweetCard: React.FC<Props & ComponentProps<'div'>> = ({
  tweet,
  ...rest
}) => {
  const [deleteTweet, { isLoading: isDeleting }] = useDeleteTweetMutation()

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation()

    if (window.confirm('Are you sure you want to delete this tweet?')) {
      try {
        await deleteTweet(tweet.id).unwrap()
        dispatch(
          enqueSnackbar({
            color: 'green',
            message: 'Tweet deleted successfully',
          }),
        )
      } catch {
        dispatch(
          enqueSnackbar({
            color: 'red',
            message: 'Failed to delete tweet',
          }),
        )
      }
    }
  }

  return (
    <div
      {...rest}
      data-testid={`tweet-card-${tweet.id}`}
      className="relative rounded-md border border-gray-200 p-4 dark:border-gray-700 dark:text-white"
    >
      <button
        onClick={handleDelete}
        disabled={isDeleting}
        data-testid={`delete-tweet-${tweet.id}`}
        className="absolute top-2 right-2 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 disabled:opacity-50 dark:hover:bg-gray-800 dark:hover:text-gray-300"
        title="Delete tweet"
      >
        <X size={16} />
      </button>
      {tweet.text}
    </div>
  )
}
