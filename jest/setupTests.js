import '@testing-library/jest-dom'
import MatchMediaMock from 'jest-matchmedia-mock'

// Polyfill "window.fetch" used in the React component.
import 'whatwg-fetch'
import { server } from '../mocks/server'

let matchMedia

beforeAll(() => {
  server.listen()
  matchMedia = new MatchMediaMock()
})

beforeEach(() => server.resetHandlers())

afterEach(() => {
  matchMedia.clear()
  server.resetHandlers()
})

afterAll(() => server.close())
