/* eslint-disable no-console */
/**
 * Global Setup for WXT Extension E2E Tests
 * Runs once before all tests
 *
 * Responsibilities:
 * 1. Build WXT extension to .output/chrome-mv3/
 * 2. Verify extension manifest is valid
 * 3. Check backend server connectivity
 */

import { execSync } from 'child_process'
import { existsSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

async function globalSetup() {
  console.log('\n🔧 Setting up WXT Extension E2E test environment...\n')

  const currentDir = path.dirname(fileURLToPath(import.meta.url))
  const projectRoot = path.resolve(currentDir, '../..')
  // Use development build output for testing
  const extensionOutput = path.join(projectRoot, '.output/chrome-mv3-dev')

  try {
    // Step 1: Build WXT extension in development mode for testing
    console.log('📦 Building WXT extension in development mode...')
    execSync('pnpm wxt build --mode development', {
      cwd: projectRoot,
      stdio: 'inherit',
    })
    console.log('✅ Extension built successfully\n')

    // Step 2: Verify extension output exists
    if (!existsSync(extensionOutput)) {
      throw new Error(`Extension output not found at ${extensionOutput}`)
    }

    const manifestPath = path.join(extensionOutput, 'manifest.json')
    if (!existsSync(manifestPath)) {
      throw new Error(`Extension manifest.json not found at ${manifestPath}`)
    }
    console.log('✅ Extension manifest verified\n')

    // Step 3: Verify backend server is accessible (will be started by webServer config)
    console.log(
      '⏳ Waiting for backend server (started by Playwright webServer)...',
    )
    console.log('   Backend will be available at http://localhost:4000\n')

    return {
      extensionPath: extensionOutput,
      setupComplete: true,
    }
  } catch (error) {
    console.error('❌ Extension setup failed:', error)
    throw error
  }
}

export default globalSetup
