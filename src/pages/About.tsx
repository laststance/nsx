import type { RouteComponentProps } from '@reach/router'
import React, { memo } from 'react'

import Layout from '../components/Layout'

const About = memo<RouteComponentProps>(
  () => (
    <Layout>
      <h1 className="text-3xl pt-4 pb-6">About</h1>
      <section className="text-xl leading-8 space-y-4">
        <p>
          The Blog logging what todaly I learned everyday by{' '}
          <a
            href="https://ryota-murakami.github.io/"
            target="_blank"
            rel="noreferrer"
            className="text-gray-600 hover:text-gray-400"
          >
            Ryota Murakami
          </a>
          .
          <br />
          Almost posts are just listing web page link that I read any web dev
          resource that day.
        </p>
        <p>
          It's save me from depression and remind whatever I known me when I
          feel like no grow up as a Web Engineer.
        </p>
        <p>
          Here is a part of{' '}
          <a
            href="https://laststance.io/"
            target="_blank"
            rel="noreferrer"
            className="text-gray-600 hover:text-gray-400"
          >
            Laststance.io
          </a>
          's activity.
        </p>
      </section>
    </Layout>
  ),
  () => true
)

About.displayName = 'About'

export default About
