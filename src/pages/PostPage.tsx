import React, { useEffect, useState } from 'react'
import { Link, RouteComponentProps } from '@reach/router'
import breaks from 'remark-breaks'
import gfm from 'remark-gfm'
import ReactMarkdown from 'react-markdown'
import { useSelector, useDispatch } from 'react-redux'
import { Dispatch } from 'redux'
import { Post } from '../../DataStructure'
import Container from '../components/Container'
import Button from '../elements/Button'
import { ReduxState, EnqueueSnackbarAction } from '../redux'
import { A, H1, P, UL } from '../elements/react-markdown-custom-components'
import axios from 'axios'

interface RouterParam {
  postId: Post['id']
}

const PostPage: React.FC<RouteComponentProps<RouterParam>> = ({ postId }) => {
  const [post, setPost] = useState<Post>()
  const dispatch: Dispatch<EnqueueSnackbarAction> = useDispatch()
  const login = useSelector<ReduxState>((state) => state.login)

  useEffect(() => {
    async function fetchPost() {
      try {
        const { data } = await axios.get<Post>(
          `${process.env.REACT_APP_API_ENDPOINT}/post/${postId}`
        )
        setPost(data)
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error)
        dispatch({
          type: 'ENQUEUE_SNACKBAR_MESSAGE',
          payload: { message: error.message, color: 'red' },
        })
      }
    }
    fetchPost()
  }, [dispatch, postId])

  return (
    <Container data-cy="postPage">
      {post && (
        <>
          <h1 className="text-3xl pt-4 pb-6">{post.title}</h1>
          <ReactMarkdown
            components={{ a: A, p: P, ul: UL, h1: H1 }}
            remarkPlugins={[breaks, gfm]}
            className="text-xl leading-8"
          >
            {post.body}
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
    </Container>
  )
}

export default React.memo(PostPage)
