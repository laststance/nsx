import { defineConfig } from 'cypress'

export default defineConfig({
  defaultCommandTimeout: 5000,

  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    async setupNodeEvents(on, config) {
      return require('./cypress/plugins/index.js')(on, config)
    },

    testIsolation: true,
  },
  video: false,
  viewportHeight: 900,
  viewportWidth: 1500,
})
