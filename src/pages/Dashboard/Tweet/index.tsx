import { zodResolver } from '@hookform/resolvers/zod'
import * as Sentry from '@sentry/react'
import type React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { AppError } from '@/src/components/AppError'
import Button from '@/src/components/Button/Button'
import Input from '@/src/components/Input/Input'
import Layout from '@/src/components/Layout'
import Loading from '@/src/components/Loading'
import ButtonGroup from '@/src/components/Pagination/ButtonGroup'
import { useTweetPagination } from '@/src/components/Pagination/usePagination'
import { TweetCard } from '@/src/components/TweetCard'
import { useCreateTweetMutation, useDeleteTweetMutation } from '@/src/redux/API'
import isSuccess from '@/src/redux/helper/isSuccess'
import { enqueSnackbar } from '@/src/redux/snackbarSlice'
import { dispatch } from '@/src/redux/store'
import type { Tweet as TweetType } from '@/validator'
type TweetFormData = Pick<TweetType, 'text'>

export const Tweet: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TweetFormData>({
    // TODO: set picked field from tweetSchema to zodResolver
    resolver: zodResolver(
      z.object({ text: z.string().trim().min(1).max(140) }),
    ),
  })
  const { data, isLoading, error, page, totalPage } = useTweetPagination(10)
  const [createTweet, { isLoading: isCreatingTweet }] = useCreateTweetMutation()
  const [deleteTweet] = useDeleteTweetMutation()

  // Only show loading spinner for initial data fetch, not during tweet creation
  if (isLoading) return <Loading />
  if (error) return <AppError error={error} />

  const onSubmit = async (data: TweetFormData) => {
    const result = await createTweet(data.text)

    if (isSuccess(result)) {
      // RTK Query will automatically refetch the tweet list due to cache invalidation
      // The createTweet mutation has invalidatesTags: ['Tweets'] which will trigger
      // refetch of useFetchAllTweetQuery that has providesTags: ['Tweets']
      reset()
      dispatch(
        enqueSnackbar({
          color: 'green',
          message: 'Tweet created successfully',
        }),
      )
    } else {
      // TODO: Move Error Handling to Axios Error Interceptor
      Sentry.captureException(JSON.stringify(result.error, null, 2))
      dispatch(
        enqueSnackbar({
          color: 'red',
          message: JSON.stringify(result.error, null, 2),
        }),
      )
    }
  }

  const onDelete = async (id: number) => {
    const result = await deleteTweet(id)

    if (isSuccess(result)) {
      dispatch(
        enqueSnackbar({
          color: 'green',
          message: 'Tweet deleted successfully',
        }),
      )
    } else {
      Sentry.captureException(JSON.stringify(result.error, null, 2))
      dispatch(
        enqueSnackbar({
          color: 'red',
          message: 'Failed to delete tweet',
        }),
      )
    }
  }

  return (
    <Layout className="flex flex-col justify-start">
      <h2 className="mb-4 text-2xl font-bold dark:text-white">Tweets</h2>

      <form className="mx-auto flex gap-2" onSubmit={handleSubmit(onSubmit)}>
        <Input
          reactHookFormParams={{
            name: 'text',
            fieldError: errors['text'],
            register,
          }}
        />
        <Button type="submit" isLoading={isCreatingTweet}>
          Submit
        </Button>
      </form>

      <section className="flex h-full flex-col justify-between">
        {data && (
          <div className="mt-4 grid gap-4">
            {data.tweetList.length === 0 && (
              <p className="text-gray-500 dark:text-white">
                No tweets found. Be the first to post!
              </p>
            )}
            {data.tweetList.map((tweet: TweetType) => (
              <TweetCard key={tweet.id} tweet={tweet} onDelete={onDelete} />
            ))}
          </div>
        )}
        <ButtonGroup page={page} totalPage={totalPage} />
      </section>
    </Layout>
  )
}
