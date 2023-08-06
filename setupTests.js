import matchers from '@testing-library/jest-dom/matchers'
import MatchMediaMock from 'vitest-matchmedia-mock'

// extends Vitest's expect method with methods from react-testing-library
expect.extend(matchers)
// Polyfill "window.fetch" used in the React component.
import 'node-fetch'
import { server } from './mocks/server'

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
