import type { Request, Response, Router } from 'express'
import express from 'express'

import Logger from '../lib/Logger'
import { getMetricsContentType, getMetricsPayload } from '../lib/monitoring'
import { captureException } from '../lib/sentry'
import { prisma } from '../prisma'

const router: Router = express.Router()

type HealthResponse = {
  checks: {
    database: 'ok' | 'error'
  }
  error?: string
  status: 'ok' | 'error'
  timestamp: string
  uptimeSeconds: number
}

type MetricsErrorResponse = {
  code: 'METRICS_UNAVAILABLE'
  error: 'Internal Server Error'
}

/**
 * Builds the health response shared by success and failure branches.
 * @param databaseStatus - Result of the Prisma connectivity check.
 * @param error - Optional safe human-readable failure reason.
 * @returns Stable JSON payload for uptime services and deploy checks.
 * @example buildHealthResponse('ok')
 */
const buildHealthResponse = (
  databaseStatus: HealthResponse['checks']['database'],
  error?: HealthResponse['error'],
): HealthResponse => {
  return {
    checks: {
      database: databaseStatus,
    },
    ...(error ? { error } : {}),
    status: databaseStatus === 'ok' ? 'ok' : 'error',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.round(process.uptime()),
  }
}

/**
 * Verifies API and database reachability for uptime monitors and deploys.
 * @param _req - Incoming health check request.
 * @param res - Express response containing health status JSON.
 * @returns Nothing; sends 200 when healthy and 503 when DB is unreachable.
 * @example GET /api/health
 */
const getHealth = async (_req: Request, res: Response<HealthResponse>) => {
  try {
    await prisma.$queryRaw`SELECT 1`
    res.status(200).json(buildHealthResponse('ok'))
  } catch (error) {
    Logger.error('Health check failed', { error })
    captureException(error)
    res.status(503).json(buildHealthResponse('error', 'Database unreachable'))
  }
}

/**
 * Exposes process and HTTP metrics for Prometheus-compatible scrapers.
 * @param _req - Incoming metrics request.
 * @param res - Express response containing Prometheus text exposition.
 * @returns Nothing; sends the serialized metrics registry.
 * @example GET /api/metrics
 */
const getMetrics = async (
  _req: Request,
  res: Response<string | MetricsErrorResponse>,
) => {
  try {
    res.type(getMetricsContentType()).send(await getMetricsPayload())
  } catch (error) {
    Logger.error('Metrics endpoint failed', { error })
    captureException(error)
    res.status(500).json({
      code: 'METRICS_UNAVAILABLE',
      error: 'Internal Server Error',
    })
  }
}

router.get('/health', getHealth)
router.get('/metrics', getMetrics)

export default router
