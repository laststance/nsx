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
import { TweetCard } from '@/src/components/TweetCard'
import { useFetchAllTweetQuery, useCreateTweetMutation } from '@/src/redux/API'
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
  } = useForm<TweetFormData>({
    // TODO: set picked field from tweetSchema to zodResolver
    resolver: zodResolver(z.object({ text: z.string().min(1) })),
  })
  const { data, isLoading, error } = useFetchAllTweetQuery({})
  const [createTweet, { isLoading: isCreatingTweet }] = useCreateTweetMutation()

  if (isLoading || isCreatingTweet) return <Loading />
  if (error) return <AppError error={error} />
  console.log(register)
  const onSubmit = async (data: TweetFormData) => {
    const result = await createTweet(data.text)

    if (isSuccess(result)) {
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

  return (
    <Layout className="flex flex-col justify-start">
      <h1 className="mb-4 text-2xl font-bold dark:text-white">Tweets</h1>

      <form className="mx-auto flex gap-2" onSubmit={handleSubmit(onSubmit)}>
        <Input
          reactHookFormPrams={{
            name: 'text',
            fieldError: errors['text'],
            register,
          }}
        />
        <Button type="submit">Submit</Button>
      </form>

      {data && (
        <div className="mt-4 grid gap-4">
          {data.length === 0 && (
            <p className="text-gray-500 dark:text-white">
              No tweets found. Be the first to post!
            </p>
          )}
          {data.map((tweet: TweetType) => (
            <TweetCard key={tweet.id} tweet={tweet} />
          ))}
        </div>
      )}
    </Layout>
  )
}
