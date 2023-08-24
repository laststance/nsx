import '@testing-library/jest-dom/vitest'
import MatchMediaMock from 'vitest-matchmedia-mock'

// Polyfill "window.fetch" used in the React component.
import 'node-fetch'
import { server } from './mocks/server'

let matchMedia: InstanceType<typeof MatchMediaMock>

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
