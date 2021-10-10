import { Link } from '@reach/router'
import React, { memo, Suspense } from 'react'
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import breaks from 'remark-breaks'
import gfm from 'remark-gfm'

import Layout from '../../components/Layout'
import Button from '../../elements/Button'
import Loading from '../../elements/Loading'
import type { AdminState } from '../../redux/adminSlice'

import Head from './Head'
import { getCustomComponents } from './ReactMarkdownCostomComponents'

interface Props {
  post: Post
  login: AdminState['login']
}

const Body: React.FC<Props> = memo(({ post, login }) => (
  <Layout post-cy="post-page-content-root">
    <Suspense fallback={<Loading />}>
      {/* Suspence for lazyload expesive <code /> component */}

      <Head post={post} />
      <h1 className="text-2xl pt-4 pb-6 font-semibold">{post.title}</h1>
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
        <div className="pt-8 flex justify-end">
          <Link to={`/dashboard/edit/${post.id}`}>
            <Button variant="primary" post-cy="edit-btn">
              Edit
            </Button>
          </Link>
        </div>
      )}
    </Suspense>
  </Layout>
))

export default Body
