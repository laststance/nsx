import type { ComponentProps } from 'react'
import React, { memo, Suspense } from 'react'
import ReactMarkdown from 'react-markdown'
import { Link } from 'react-router-dom'
import rehypeRaw from 'rehype-raw'
import breaks from 'remark-breaks'
import gfm from 'remark-gfm'

import Button from '../../components/Button/Button'
import Layout from '../../components/Layout'
import Loading from '../../components/Loading/Loading'
import { selectLogin } from '../../redux/adminSlice'
import { useAppSelector } from '../../redux/hooks'

import Helment from './Helment'
import { a, code } from './ReactMarkdown/CostomComponents'

interface Props {
  post: Post
}

const Content: React.FC<Props & ComponentProps<any>> = memo(({ post }) => {
  const login = useAppSelector(selectLogin)

  return (
    <Suspense fallback={<Loading />}>
      {/* Suspence for lazyload expesive <code /> component */}

      <Helment post={post} />
      <h1 className="text-color-primary pt-4 pb-10 text-2xl font-semibold">
        {post.title}
      </h1>
      <article>
        <ReactMarkdown // @ts-ignore too complex
          components={{ a, code }}
          rehypePlugins={[rehypeRaw]}
          remarkPlugins={[breaks, gfm]}
          className="prose prose-lg dark:prose-invert"
        >
          {post.body}
        </ReactMarkdown>
      </article>

      {login && (
        <div className="flex justify-end pt-8">
          <Link to={`/dashboard/edit/${post.id}`}>
            <Button variant="primary" data-cy="edit-btn">
              Edit
            </Button>
          </Link>
        </div>
      )}
    </Suspense>
  )
})
Content.displayName = 'Content'

const ContentPage: React.FC<Props & ComponentProps<any>> = memo(
  ({ post }) => (
    <Layout>
      <Content post={post} />
    </Layout>
  ),
  () => true
)
ContentPage.displayName = 'ContentPage'

export default ContentPage
