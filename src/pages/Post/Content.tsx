import type { ComponentProps } from 'react'
import React, { memo } from 'react'
import ReactMarkdown from 'react-markdown'
import { Link } from 'react-router'
import rehypeRaw from 'rehype-raw'
import breaks from 'remark-breaks'
import gfm from 'remark-gfm'

import Button from '@/src/components/Button'
import Layout from '@/src/components/Layout'

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
          // @ts-ignore Type LegacyRef<HTMLAnchorElement> | undefined is not assignable to type Ref<HTMLAnchorElement> | undefined
          components={{ a }}
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
            <Button variant="primary" data-testid="edit-btn">
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
