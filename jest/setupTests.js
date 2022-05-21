import '@testing-library/jest-dom'
import MatchMediaMock from 'jest-matchmedia-mock'
import { jestPreviewConfigure } from 'jest-preview'

jestPreviewConfigure({
  autoPreview: true,
  externalCss: ['src/index.css'],
  publicFolder: './',
})

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
