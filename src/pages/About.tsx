import React, { memo } from 'react'
import type { RouteComponentProps } from '@reach/router'
import Layout from '../components/Layout'

const About = memo<RouteComponentProps>(
  () => (
    <Layout>
      <h1 className="text-3xl pt-4 pb-6">About</h1>
      <section className="text-xl leading-8">
        This Blog built for logging roughly what todaly I learned everyday by{' '}
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
        I'm writing very broken note here that what today I
        learned/read/acomplished/struggled whatever.
        <br />
        <br />
        It's save me from depression and remind whatever I known me when I feel
        like no grow up as a Web Engineer.
        <br />
        <br />
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
      </section>
    </Layout>
  ),
  () => true
)

export default About
