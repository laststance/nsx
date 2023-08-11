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
          I implement feature based on my want(.e.g{' '}
          <a
            target="_blank"
            href="https://github.com/laststance/nsx-browser-extension"
          >
            nsx browser extension
          </a>
          ) and expeliment/learn new library feelfree.
          <br />
          Therefore, it is a free-form project that also space as a technical
          sandbox.
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
