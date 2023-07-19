import React, { memo } from 'react'

import Layout from '../../components/Layout'

const About = memo(
  () => (
    <>
      <h1 className="text-color-primary pb-6 pt-4 text-3xl">About</h1>
      <section className="text-color-primary space-y-4 text-xl leading-8">
        <p>
          This is just a garbage blog written by{' '}
          <a
            href="https://ryota-murakami.github.io/"
            target="_blank"
            rel="noreferrer"
            className="font-medium leading-6 no-underline hover:underline"
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
            className="font-medium leading-6 no-underline hover:underline"
          >
            Laststance.io
          </a>{' '}
          projects.
        </p>
        <p>
          I want to create fullstack modern web application without frameworks
          like Next.js, Remix, RedwoodJS, Blitz.js, at the project.
        </p>
      </section>
    </>
  ),
  () => true,
)
About.displayName = 'About'

const AboutPage = memo(() => (
  <Layout>
    <About />
  </Layout>
))
AboutPage.displayName = 'AboutPage'

export default AboutPage
