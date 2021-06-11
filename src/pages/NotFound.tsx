import React from 'react'
import { RouteComponentProps } from '@reach/router'
import Container from '../components/Container'

const NotFound: React.FC<RouteComponentProps> = (props) => (
  <Container className="flex justify-center items-center">
    <h1 className="text-6xl">Page Not Found</h1>
  </Container>
)

export default React.memo(NotFound)
