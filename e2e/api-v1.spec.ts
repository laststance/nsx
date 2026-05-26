import { expect, test } from '@playwright/test'

test.describe('API v1 response contract', () => {
  test('/api/v1/posts wraps paginated posts in a standard success envelope', async ({
    request,
  }) => {
    // Arrange
    const postsEndpoint = '/api/v1/posts?page=1&perPage=5'

    // Act
    const response = await request.get(postsEndpoint)
    const body = await response.json()

    // Assert
    expect(response.status()).toBe(200)
    expect(body).toMatchObject({
      message: 'Posts retrieved',
      meta: {
        pagination: {
          hasPrev: false,
          page: 1,
          perPage: 5,
        },
      },
      success: true,
    })
    expect(Array.isArray(body.data)).toBe(true)
    expect(typeof body.timestamp).toBe('string')
    expect(typeof body.requestId).toBe('string')
  })

  test('/api/v1/posts/:id returns a standard not found error envelope', async ({
    request,
  }) => {
    // Arrange
    const missingPostEndpoint = '/api/v1/posts/999999999'

    // Act
    const response = await request.get(missingPostEndpoint)
    const body = await response.json()

    // Assert
    expect(response.status()).toBe(404)
    expect(body).toMatchObject({
      code: 'NOT_FOUND',
      error: 'Post not found',
      success: false,
    })
    expect(body.stack).toBeUndefined()
    expect(typeof body.requestId).toBe('string')
  })

  test('/api/v1/posts/:id rejects malformed IDs with a standard validation error', async ({
    request,
  }) => {
    // Arrange
    const malformedPostEndpoint = '/api/v1/posts/not-a-number'

    // Act
    const response = await request.get(malformedPostEndpoint)
    const body = await response.json()

    // Assert
    expect(response.status()).toBe(400)
    expect(body).toMatchObject({
      code: 'VALIDATION_ERROR',
      error: 'Route id must be a positive integer',
      success: false,
    })
  })

  test('/api/v1/users/count wraps user count in a standard success envelope', async ({
    request,
  }) => {
    // Arrange
    const userCountEndpoint = '/api/v1/users/count'

    // Act
    const response = await request.get(userCountEndpoint)
    const body = await response.json()

    // Assert
    expect(response.status()).toBe(200)
    expect(body).toMatchObject({
      data: {
        userCount: expect.any(Number),
      },
      message: 'User count retrieved',
      success: true,
    })
  })

  test('/api/v1/openapi.json exposes API documentation metadata', async ({
    request,
  }) => {
    // Arrange
    const openApiEndpoint = '/api/v1/openapi.json'

    // Act
    const response = await request.get(openApiEndpoint)
    const body = await response.json()

    // Assert
    expect(response.status()).toBe(200)
    expect(body).toMatchObject({
      data: {
        info: {
          title: 'NSX API',
          version: '1.0.0',
        },
        openapi: '3.0.0',
      },
      success: true,
    })
  })
})
