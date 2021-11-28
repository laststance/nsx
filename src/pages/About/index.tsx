import type { RouteComponentProps } from '@reach/router'
import React, { memo } from 'react'

import Layout from '../../components/Layout'

const About = memo<RouteComponentProps>(
  () => (
    <Layout>
      <h1 className="pt-4 pb-6 text-3xl">About</h1>
      <section className="space-y-4 text-xl leading-8">
        <p>
          This is just a garbage blog written by{' '}
          <a
            href="https://ryota-murakami.github.io/"
            target="_blank"
            rel="noreferrer"
            className="hover:underline font-medium leading-6 no-underline"
          >
            Ryota Murakami
          </a>
          .
          <br />
          Web Dev things only.
        </p>
        <p>
          Although it's save me sometimes from depression(aka Impostor
          syndrome). <br />
          That even random and cursory notes, however sometimes that useful to
          remember the Web Dev activities you've done.
        </p>
        <p>
          This is a part of{' '}
          <a
            href="https://laststance.io/"
            target="_blank"
            rel="noreferrer"
            className="hover:underline font-medium leading-6 no-underline"
          >
            Laststance.io
          </a>{' '}
          projects.
        </p>
      </section>
    </Layout>
  ),
  () => true
)
About.displayName = 'About'
export default About
