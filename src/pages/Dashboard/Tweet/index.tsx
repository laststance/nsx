import type React from 'react'
import { useState, useEffect } from 'react'
import { TweetCard } from '@/src/components/TweetCard'
import { getTweets } from '@/src/api/tweets'

import Layout from '@/src/components/Layout'
export const Tweet: React.FC = () => {
  const [tweets, setTweets] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTweets = async () => {
      try {
        setIsLoading(true)
        const data = await getTweets()
        setTweets(data)
      } catch (err) {
        setError('Failed to fetch tweets')
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTweets()
  }, [])

  return (
    <Layout className="flex flex-col justify-start">
      <h1 className="text-2xl font-bold mb-4">Tweets</h1>
      <p className="mb-4">This page will display and manage tweets.</p>
      {isLoading && <p>Loading tweets...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!isLoading && !error && tweets.length === 0 && <p>No tweets found.</p>}
      <div className="grid gap-4 mt-4">
        {tweets.map(tweet => (
          <TweetCard key={tweet.id} tweet={tweet} />
        ))}
      </div>
    </Layout>
  )
}
