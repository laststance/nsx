import React from 'react'
import { Link, RouteComponentProps } from '@reach/router'
import gfm from 'remark-gfm'
import ReactMarkdown from 'react-markdown'
import { useSelector } from 'react-redux'
import { Post } from '../../DataStructure'

import Layout from '../components/Layout'
import useSinglePost from '../hooks/useSinglePost'
import { ReduxState } from '../redux'

const A = (
  props: JSX.IntrinsicAttributes &
    React.ClassAttributes<HTMLAnchorElement> &
    React.AnchorHTMLAttributes<HTMLAnchorElement>
  // eslint-disable-next-line jsx-a11y/anchor-has-content
) => <a {...props} target="_blank" className="text-blue-700"></a>

interface RouterParam {
  postId: Post['id']
}

const PostPage: React.FC<RouteComponentProps<RouterParam>> = ({ postId }) => {
  // @ts-ignore
  const post = useSinglePost(postId)
  const login = useSelector<ReduxState>((state) => state.login)

  return (
    <Layout>
      {post && (
        <>
          <h1 className="text-3xl mt-2 mb-2">{post.title}</h1>
          <ReactMarkdown
            components={{ a: A }}
            remarkPlugins={[gfm]}
            className="text-xl"
          >
            {post.body}
          </ReactMarkdown>
        </>
      )}
      {login && (
        <div className="mt-4">
          <Link to={`/dashboard/edit/${postId}`}>
            <button className="mt-3 shadow bg-green-400 hover:bg-green-500 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded">
              Edit
            </button>
          </Link>
        </div>
      )}
    </Layout>
  )
}

export default React.memo(PostPage)
