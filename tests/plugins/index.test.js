import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

// Mock vuetify plugin
vi.mock('../../src/plugins/vuetify', () => ({
  default: {
    install: vi.fn()
  }
}))

describe('registerPlugins', () => {
  let mockApp
  let consoleSpy
  let consoleErrorSpy

  beforeEach(async () => {
    // Create mock Vue app
    mockApp = {
      use: vi.fn()
    }

    // Spy on console methods
    consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    // Clear all mocks
    vi.clearAllMocks()
    vi.resetModules()
  })

  afterEach(() => {
    vi.clearAllMocks()
    consoleSpy.mockRestore()
    consoleErrorSpy.mockRestore()
    // Restore original environment
    vi.unstubAllEnvs()
  })

  it('should register vuetify plugin successfully', async () => {
    vi.stubEnv('MODE', 'production')

    const { registerPlugins } = await import('../../src/plugins/index.js')
    registerPlugins(mockApp)

    expect(mockApp.use).toHaveBeenCalledTimes(1)
    expect(mockApp.use).toHaveBeenCalledWith(expect.any(Object))
  })

  it('should log success message in development mode', async () => {
    vi.stubEnv('MODE', 'development')

    const { registerPlugins } = await import('../../src/plugins/index.js')
    registerPlugins(mockApp)

    expect(consoleSpy).toHaveBeenCalledWith('Plugins registered successfully')
    expect(mockApp.use).toHaveBeenCalledTimes(1)
  })

  it('should not log success message in production mode', async () => {
    vi.stubEnv('MODE', 'production')

    const { registerPlugins } = await import('../../src/plugins/index.js')
    registerPlugins(mockApp)

    expect(consoleSpy).not.toHaveBeenCalled()
    expect(mockApp.use).toHaveBeenCalledTimes(1)
  })

  it('should handle plugin registration errors and re-throw them', async () => {
    vi.stubEnv('MODE', 'production')

    const testError = new Error('Plugin registration failed')
    mockApp.use.mockImplementationOnce(() => {
      throw testError
    })

    const { registerPlugins } = await import('../../src/plugins/index.js')

    expect(() => {
      registerPlugins(mockApp)
    }).toThrow('Plugin registration failed')

    expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to register plugins:', testError)
    expect(mockApp.use).toHaveBeenCalledTimes(1)
  })

  it('should handle plugin registration errors in development mode', async () => {
    vi.stubEnv('MODE', 'development')

    const testError = new Error('Plugin registration failed')
    mockApp.use.mockImplementationOnce(() => {
      throw testError
    })

    const { registerPlugins } = await import('../../src/plugins/index.js')

    expect(() => {
      registerPlugins(mockApp)
    }).toThrow('Plugin registration failed')

    expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to register plugins:', testError)
    expect(consoleSpy).not.toHaveBeenCalledWith('Plugins registered successfully')
  })

  it('should work with different environment modes', async () => {
    const testModes = ['development', 'production', 'test', 'staging']

    for (const mode of testModes) {
      // Clear mocks before each iteration
      vi.clearAllMocks()
      consoleSpy.mockClear()

      // Set environment mode
      vi.stubEnv('MODE', mode)

      // Import fresh module
      const { registerPlugins } = await import('../../src/plugins/index.js')
      registerPlugins(mockApp)

      if (mode === 'development') {
        expect(consoleSpy).toHaveBeenCalledWith('Plugins registered successfully')
      } else {
        expect(consoleSpy).not.toHaveBeenCalled()
      }

      // Reset modules for next iteration
      vi.resetModules()
    }
  })
})
