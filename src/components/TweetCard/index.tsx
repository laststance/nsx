import { X, Languages, Share } from 'lucide-react'
import React, { useState, type ComponentProps } from 'react'

import {
  useTranslateTextMutation,
  usePostToBlueSkyMutation,
  useCreateTweetMutation,
  useGetHoverColorPreferenceQuery,
} from '@/src/redux/API'
import { enqueSnackbar } from '@/src/redux/snackbarSlice'
import { dispatch } from '@/src/redux/store'
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
  const [isHovered, setIsHovered] = useState(false)
  const [translateText, { isLoading: isTranslating }] =
    useTranslateTextMutation()
  const [postToBlueSky, { isLoading: isPosting }] = usePostToBlueSkyMutation()
  const [createTweet, { isLoading: isCreating }] = useCreateTweetMutation()
  const { data: preferenceData } = useGetHoverColorPreferenceQuery()

  const useLegacyColors = preferenceData?.useLegacyHoverColors ?? false

  // Color classes based on preference
  const translateButtonColors = useLegacyColors
    ? 'dark:border-cyan-400/40 dark:bg-cyan-600/75 dark:shadow-cyan-500/25 dark:hover:bg-cyan-500/85'
    : 'dark:border-orange-300/40 dark:bg-orange-500/75 dark:shadow-orange-400/25 dark:hover:bg-orange-400/85'

  const blueSkyButtonColors = useLegacyColors
    ? 'dark:border-amber-400/40 dark:bg-amber-600/75 dark:shadow-amber-500/25 dark:hover:bg-amber-500/85'
    : 'dark:border-blue-300/40 dark:bg-blue-500/75 dark:shadow-blue-400/25 dark:hover:bg-blue-400/85'

  const handleTranslate = async () => {
    try {
      const result = await translateText(tweet.text).unwrap()

      if (result.isTranslated) {
        // Create a new tweet with the translated text
        await createTweet(result.translatedText).unwrap()

        dispatch(
          enqueSnackbar({
            color: 'green',
            message: 'Translation completed and new English tweet created!',
          }),
        )
      } else {
        dispatch(
          enqueSnackbar({
            color: 'green',
            message: 'Text is already in English - no translation needed',
          }),
        )
      }
    } catch (error) {
      console.error('Translation error:', error)
      dispatch(
        enqueSnackbar({
          color: 'red',
          message: 'Translation failed. Please try again.',
        }),
      )
    }
  }

  const handleBlueSkyPost = async () => {
    try {
      const result = await postToBlueSky(tweet.text).unwrap()
      dispatch(
        enqueSnackbar({
          color: 'green',
          message: result.message,
        }),
      )
    } catch (error) {
      console.error('BlueSky post error:', error)
      dispatch(
        enqueSnackbar({
          color: 'red',
          message: 'Failed to post to BlueSky. Please try again.',
        }),
      )
    }
  }

  return (
    <div
      {...rest}
      data-testid={`tweet-card-${tweet.id}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative rounded-md border border-gray-200 p-4 transition-all duration-200 hover:shadow-md dark:border-gray-700 dark:text-white"
    >
      {/* Action buttons - positioned to not overlap with delete button */}
      {isHovered && (
        <div className="absolute top-2 left-2 z-10 flex gap-2">
          <button
            onClick={handleTranslate}
            disabled={isTranslating || isCreating}
            className={`flex min-h-[32px] min-w-[44px] items-center gap-1 rounded-full bg-orange-500 px-3 py-1 text-sm text-white transition-all duration-200 hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50 dark:border dark:shadow-lg dark:backdrop-blur-md ${translateButtonColors}`}
            data-testid={`translate-tweet-${tweet.id}`}
            aria-label="Translate tweet to English and create new tweet"
          >
            {isTranslating || isCreating ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <>
                <Languages className="h-4 w-4" />
                <span className="hidden sm:inline">Translate</span>
              </>
            )}
          </button>

          <button
            onClick={handleBlueSkyPost}
            disabled={isPosting}
            className={`flex min-h-[32px] min-w-[44px] items-center gap-1 rounded-full bg-blue-500 px-3 py-1 text-sm text-white transition-all duration-200 hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50 dark:border dark:shadow-lg dark:backdrop-blur-md ${blueSkyButtonColors}`}
            data-testid={`bluesky-post-${tweet.id}`}
            aria-label="Post to BlueSky"
          >
            {isPosting ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <>
                <Share className="h-4 w-4" />
                <span className="hidden sm:inline">BlueSky</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Delete button - moved to avoid overlap with new buttons */}
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

      {/* Tweet content */}
      <div className="pr-8">{tweet.text}</div>
    </div>
  )
}
