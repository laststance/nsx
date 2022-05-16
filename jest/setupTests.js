import '@testing-library/jest-dom'
import MatchMediaMock from 'jest-matchmedia-mock'

// Polyfill "window.fetch" used in the React component.
import 'whatwg-fetch'
import { server } from '../mocks/server'

// Assuming requestAnimationFrame is roughly 60 frames per second
let frame = 1000 / 60
let amountOfFrames = 2

let formatter = new Intl.NumberFormat('en')

expect.extend({
  toBeWithinRenderFrame(actual, expected) {
    let min = expected - frame * amountOfFrames
    let max = expected + frame * amountOfFrames

    let pass = actual >= min && actual <= max

    return {
      message: pass
        ? () => {
            return `expected ${actual} not to be within range of a frame ${formatter.format(
              min
            )} - ${formatter.format(max)}`
          }
        : () => {
            return `expected ${actual} not to be within range of a frame ${formatter.format(
              min
            )} - ${formatter.format(max)}`
          },
      pass,
    }
  },
})

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
