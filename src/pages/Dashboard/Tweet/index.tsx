import { zodResolver } from '@hookform/resolvers/zod'
import * as Sentry from '@sentry/react'
import type React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Error } from '@/src/components/Error'
import Layout from '@/src/components/Layout'
import Loading from '@/src/components/Loading'
import { TweetCard } from '@/src/components/TweetCard'
import { useFetchAllTweetQuery, useCreateTweetMutation } from '@/src/redux/API'
import isSuccess from '@/src/redux/helper/isSuccess'
import { enqueSnackbar } from '@/src/redux/snackbarSlice'
import { dispatch } from '@/src/redux/store'
import type { Tweet as TweetType } from '@/validator'
type TweetFormData = Pick<TweetType, 'text'>

export const Tweet: React.FC = () => {
  const { register, handleSubmit } = useForm<TweetFormData>({
    // TODO: set picked field from tweetSchema to zodResolver
    resolver: zodResolver(z.object({ text: z.string().min(1) })),
  })
  const { data, isLoading, error } = useFetchAllTweetQuery({})
  const [createTweet, { isLoading: isCreatingTweet }] = useCreateTweetMutation()

  if (isLoading || isCreatingTweet) return <Loading />
  if (error) return <Error error={error} />

  const onSubmit = async (data: TweetFormData) => {
    const result = await createTweet({ text: data.text })

    if (isSuccess(result)) {
      dispatch(
        enqueSnackbar({
          color: 'green',
          message: 'Tweet created successfully',
        }),
      )
    } else {
      Sentry.captureException(result.error)
      dispatch(
        enqueSnackbar({
          color: 'red',
          message: JSON.stringify(result.error, null, 2),
        }),
      )
    }
  }

  return (
    <Layout className="flex flex-col justify-start">
      <h1 className="mb-4 text-2xl font-bold">Tweets</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <input {...register('text')} />
        <button type="submit">Submit</button>
      </form>

      <div className="mt-4 grid gap-4">
        {data &&
          data?.map((tweet: TweetType) => (
            <TweetCard key={tweet.id} tweet={tweet} />
          ))}
      </div>
    </Layout>
  )
}
