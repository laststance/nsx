import React, { useEffect } from 'react'
import { Link, RouteComponentProps } from '@reach/router'
import breaks from 'remark-breaks'
import gfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import ReactMarkdown from 'react-markdown'
import { useAppSelector, useAppDispatch } from '../redux/hooks'
import Layout from '../components/Layout'
import Button from '../elements/Button'
import { A, H1, P, UL } from '../elements/react-markdown-custom-components'
import { useFetchPostQuery } from '../redux/restApi'
import { selectLogin } from '../redux/adminSlice'
import { enque } from '../redux/snackbarSlice'

interface RouterParam {
  postId: string
}

const Post: React.FC<RouteComponentProps<RouterParam>> = ({ postId }) => {
  const dispatch = useAppDispatch()
  const login = useAppSelector(selectLogin)
  // @ts-ignore
  const { data, error, isLoading } = useFetchPostQuery(postId)

  useEffect(() => {
    if (error) dispatch(enque({ message: error.toString(), color: 'red' }))
  }, [dispatch, error])

  if (isLoading) return null

  return (
    <Layout data-cy="postPage">
      {data && (
        <>
          <h1 className="text-2xl pt-4 pb-6">{data.title}</h1>
          <ReactMarkdown
            rehypePlugins={[rehypeRaw]}
            components={{ a: A, p: P, ul: UL, h1: H1 }}
            remarkPlugins={[breaks, gfm]}
            className="text-lg leading-8"
          >
            {data.body}
          </ReactMarkdown>
        </>
      )}
      {login && (
        <div className="mt-16">
          <Link to={`/dashboard/edit/${postId}`}>
            <Button
              className="bg-green-500 active:bg-green-600 text-white"
              data-cy="edit-btn"
            >
              Edit
            </Button>
          </Link>
        </div>
      )}
    </Layout>
  )
}

export default React.memo(Post)
