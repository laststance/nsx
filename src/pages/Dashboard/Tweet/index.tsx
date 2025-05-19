import type React from 'react'

import { Error } from '@/src/components/Error'
import Layout from '@/src/components/Layout'
import Loading from '@/src/components/Loading'
import { TweetCard } from '@/src/components/TweetCard'
import { useFetchAllTweetQuery } from '@/src/redux/API'
import type { Tweet as TweetType } from '@/validator'

export const Tweet: React.FC = () => {
  const { data, isLoading, error } = useFetchAllTweetQuery({})

  if (isLoading) return <Loading />
  if (error) return <Error error={error} />

  if (!data) return <Loading />
  return (
    <Layout className="flex flex-col justify-start">
      <h1 className="mb-4 text-2xl font-bold">Tweets</h1>

      <div className="mt-4 grid gap-4">
        {data?.map((tweet: TweetType) => (
          <TweetCard key={tweet.id} tweet={tweet} />
        ))}
      </div>
    </Layout>
  )
}
