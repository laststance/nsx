import type { ComponentProps } from 'react'
import React, { memo } from 'react'
import ReactMarkdown from 'react-markdown'
import { Link } from 'react-router-dom'
import rehypeRaw from 'rehype-raw'
import breaks from 'remark-breaks'
import gfm from 'remark-gfm'

import Button from '../../components/Button/Button'
import Layout from '../../components/Layout'
import { selectLogin } from '../../redux/adminSlice'
import { useAppSelector } from '../../redux/hooks'

import Helment from './Helment'
import { a } from './ReactMarkdown/CostomComponents'

interface Props {
  post: Post
}

const Content: React.FC<Props & ComponentProps<any>> = memo(({ post }) => {
  const login = useAppSelector(selectLogin)

  return (
    <>
      <Helment post={post} />
      <h1 className="text-color-primary pb-10 pt-4 text-2xl font-semibold">
        {post.title}
      </h1>
      <article>
        <ReactMarkdown
          components={{ a }}
          // @ts-expect-error from rehypeRaw@v7.0.0
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
    </>
  )
})
Content.displayName = 'Content'

const ContentPage: React.FC<Props & ComponentProps<any>> = memo(
  ({ post }) => (
    <Layout>
      <Content post={post} />
    </Layout>
  ),
  () => true,
)
ContentPage.displayName = 'ContentPage'

export default ContentPage
