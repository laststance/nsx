import React from 'react'
import { RouteComponentProps } from '@reach/router'
import Container from '../components/Container'

const About: React.FC<RouteComponentProps> = () => (
  <Container>
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
    </section>
  </Container>
)

export default React.memo(About)
