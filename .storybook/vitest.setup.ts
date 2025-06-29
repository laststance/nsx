import * as a11yAddonAnnotations from '@storybook/addon-a11y/preview'
import { setProjectAnnotations } from '@storybook/react-vite'
import { worker } from '../mocks/browser'
import * as projectAnnotations from './preview'

// This is an important step to apply the right configuration when testing your stories.
// More info at: https://storybook.js.org/docs/api/portable-stories/portable-stories-vitest#setprojectannotations
setProjectAnnotations([a11yAddonAnnotations, projectAnnotations])

// Start MSW in browser environment
beforeAll(async () => {
  await worker.start({ onUnhandledRequest: 'bypass' })
})

afterAll(() => {
  worker.stop()
})
