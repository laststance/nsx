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
  status: 'ok' | 'error'
  timestamp: string
  uptimeSeconds: number
}

/**
 * Builds the health response shared by success and failure branches.
 * @param databaseStatus - Result of the Prisma connectivity check.
 * @returns Stable JSON payload for uptime services and deploy checks.
 * @example buildHealthResponse('ok')
 */
const buildHealthResponse = (
  databaseStatus: HealthResponse['checks']['database'],
): HealthResponse => {
  return {
    checks: {
      database: databaseStatus,
    },
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
    res.status(503).json(buildHealthResponse('error'))
  }
}

/**
 * Exposes process and HTTP metrics for Prometheus-compatible scrapers.
 * @param _req - Incoming metrics request.
 * @param res - Express response containing Prometheus text exposition.
 * @returns Nothing; sends the serialized metrics registry.
 * @example GET /api/metrics
 */
const getMetrics = async (_req: Request, res: Response) => {
  res.type(getMetricsContentType()).send(await getMetricsPayload())
}

router.get('/health', getHealth)
router.get('/metrics', getMetrics)

export default router
