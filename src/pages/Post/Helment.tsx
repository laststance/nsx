import React, { memo } from 'react'
import { Helmet } from 'react-helmet'

import { truncateString } from '../../../lib/truncateString'

interface Props {
  post: Post
}

const Helment: React.FC<React.PropsWithChildren<Props>> = memo(
  ({ post }) => (
    <Helmet>
      <meta name="description" content={truncateString(post.body, 40)} />
      <meta property="og:title" content={post.title} />
      <meta property="og:description" content={truncateString(post.body, 40)} />
      <meta property="og:type" content="article" />
      <meta property="og:url" content="https://digitalstrength.dev" />
      <meta name="og:image" content="https://digitalstrength.dev/ogp.png" />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:site" content="@malloc007" />
      <meta
        name="twitter:image"
        content="https://digitalstrength.dev/ogp.png"
      />
      <title>{post.title}</title>
    </Helmet>
  ),
  () => true,
)
Helment.displayName = 'Helment'

export default Helment
