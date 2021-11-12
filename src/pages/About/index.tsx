import type { RouteComponentProps } from '@reach/router'
import React, { memo } from 'react'

import Layout from '../../components/Layout'

const About = memo<RouteComponentProps>(
  () => (
    <Layout>
      <h1 className="pt-4 pb-6 text-3xl">About</h1>
      <section className="space-y-4 text-xl leading-8">
        <p>
          The Blog logging what todaly I learned everyday by{' '}
          <a
            href="https://ryota-murakami.github.io/"
            target="_blank"
            rel="noreferrer"
            className="hover:text-gray-400 text-gray-600"
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
            className="hover:text-gray-400 text-gray-600"
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
