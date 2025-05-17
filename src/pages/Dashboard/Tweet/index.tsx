import type React from 'react'

import Layout from '@/src/components/Layout'
import { TweetCard } from '@/src/components/TweetCard'

export const Tweet: React.FC = () => {
  return (
    <Layout className="flex flex-col justify-start">
      <h1 className="mb-4 text-2xl font-bold">Tweets</h1>
      {!isLoading && !error && tweets.length === 0 && <p>No tweets found.</p>}
      <div className="mt-4 grid gap-4">
        {tweets.map((tweet) => (
          <TweetCard key={tweet.id} tweet={tweet} />
        ))}
      </div>
    </Layout>
  )
}
