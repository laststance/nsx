import { Link } from '@reach/router'
import React, { memo, Suspense } from 'react'
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import breaks from 'remark-breaks'
import gfm from 'remark-gfm'

import Layout from '../../components/Layout'
import Button from '../../elements/Button'
import Loading from '../../elements/Loading'
import { selectLogin } from '../../redux/adminSlice'
import { useAppSelector } from '../../redux/hooks'

import Helment from './Helment'
import { getCustomComponents } from './ReactMarkdown/CostomComponents'

interface Props {
  post: Post
}

const Content: React.FC<Props> = memo(({ post }) => {
  const login = useAppSelector(selectLogin)

  return (
    <Layout data-cy="post-page-content-root">
      <Suspense fallback={<Loading />}>
        {/* Suspence for lazyload expesive <code /> component */}

        <Helment post={post} />
        <h1 className="pt-4 pb-6 text-2xl font-semibold">{post.title}</h1>
        <ReactMarkdown // @ts-ignore too complex
          components={getCustomComponents(post)}
          /* @ts-ignore lib index.d.ts missmatch between "@types/node@16.4.12" and "rehype-raw@6.0.0" */
          rehypePlugins={[rehypeRaw]}
          /* @ts-ignore lib index.d.ts missmatch @types/mdast/index.d.ts */
          remarkPlugins={[breaks, gfm]}
          className="prose prose-lg"
        >
          {post.body}
        </ReactMarkdown>

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
    </Layout>
  )
})
Content.displayName = 'Content'

export default Content
