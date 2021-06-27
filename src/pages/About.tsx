import React from 'react'
import { RouteComponentProps } from '@reach/router'
import Container from '../components/Container'

const About: React.FC<RouteComponentProps> = () => (
  <Container>
    <h1 className="text-3xl pt-4 pb-6">About</h1>
    <section className="text-xl leading-8">
      weiojfioawefjiowaefjiowajfioajeofiaw
      <br />
      weiojfioawefjiowaefjiowajfioajeofiaw
      <br />
      weiojfioawefjiowaefjiowajfioajeofiaw
      <br />
      weiojfioawefjiowaefjiowajfioajeofiaw
      <br />
      weiojfioawefjiowaefjiowajfioajeofiaw
      <br />
      weiojfioawefjiowaefjiowajfioajeofiaw
      <br />
      weiojfioawefjiowaefjiowajfioajeofiaw
      <br />
    </section>
  </Container>
)

export default React.memo(About)
