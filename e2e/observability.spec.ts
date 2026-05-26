import { expect, test } from '@playwright/test'

test.describe('observability endpoints', () => {
  test('/api/health reports API and database are reachable', async ({
    request,
  }) => {
    // Arrange
    const healthEndpoint = '/api/health'

    // Act
    const response = await request.get(healthEndpoint)
    const body = await response.json()

    // Assert
    expect(response.status()).toBe(200)
    expect(body).toMatchObject({
      checks: {
        database: 'ok',
      },
      status: 'ok',
    })
    expect(typeof body.timestamp).toBe('string')
    expect(typeof body.uptimeSeconds).toBe('number')
  })

  test('/api/metrics exposes Prometheus HTTP request metrics', async ({
    request,
  }) => {
    // Arrange
    await request.get('/api/health')

    // Act
    const response = await request.get('/api/metrics')
    const metrics = await response.text()

    // Assert
    expect(response.status()).toBe(200)
    expect(response.headers()['content-type']).toContain('text/plain')
    expect(metrics).toContain(
      '# HELP nsx_http_requests_total Total number of HTTP requests handled by the NSX API.',
    )
    expect(metrics).toContain('nsx_http_request_duration_seconds_bucket')
  })
})
