/**
 * Centralized dotenv configuration.
 * Must be imported as the FIRST import in server/index.ts
 * so that process.env is populated before any other module accesses it.
 *
 * @example
 * // server/index.ts
 * import './env' // ← must be first
 * import router from './api'
 */
import path from 'node:path'

import dotenv from 'dotenv'

const env = process.env.NODE_ENV || 'development'
const isProd = env === 'production'

dotenv.config({
  path: isProd
    ? path.join(__dirname, './../../.env')
    : path.join(__dirname, '../.env'),
})
