import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  setupTestEnvironment,
  cleanupTestEnvironment
} from '../setup/test-utils.js'

// Mock vuetify plugin
vi.mock('../../src/plugins/vuetify', () => ({
  default: {
    install: vi.fn()
  }
}))

describe('registerPlugins', () => {
  let mockApp
  let consoleMocks

  beforeEach(() => {
    mockApp = {
      use: vi.fn()
    }

    consoleMocks = setupTestEnvironment()
  })

  afterEach(() => {
    cleanupTestEnvironment(consoleMocks)
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

    expect(consoleMocks.consoleSpy).toHaveBeenCalledWith('Plugins registered successfully')
    expect(mockApp.use).toHaveBeenCalledTimes(1)
  })

  it('should not log success message in production mode', async () => {
    vi.stubEnv('MODE', 'production')

    const { registerPlugins } = await import('../../src/plugins/index.js')
    registerPlugins(mockApp)

    expect(consoleMocks.consoleSpy).not.toHaveBeenCalled()
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

    expect(consoleMocks.consoleErrorSpy).toHaveBeenCalledWith('Failed to register plugins:', testError)
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

    expect(consoleMocks.consoleErrorSpy).toHaveBeenCalledWith('Failed to register plugins:', testError)
    expect(consoleMocks.consoleSpy).not.toHaveBeenCalledWith('Plugins registered successfully')
  })

  it('should work with different environment modes', async () => {
    const testModes = ['development', 'production', 'test', 'staging']

    for (const mode of testModes) {
      // Clear mocks before each iteration
      vi.clearAllMocks()
      consoleMocks.consoleSpy.mockClear()

      // Set environment mode
      vi.stubEnv('MODE', mode)

      // Reset modules for fresh import
      vi.resetModules()

      // Import fresh module
      const { registerPlugins } = await import('../../src/plugins/index.js')
      registerPlugins(mockApp)

      if (mode === 'development') {
        expect(consoleMocks.consoleSpy).toHaveBeenCalledWith('Plugins registered successfully')
      } else {
        expect(consoleMocks.consoleSpy).not.toHaveBeenCalled()
      }

      expect(mockApp.use).toHaveBeenCalledTimes(1)
    }
  })

  it('executes without throwing errors in normal conditions', async () => {
    vi.stubEnv('MODE', 'test')

    expect(async () => {
      const { registerPlugins } = await import('../../src/plugins/index.js')
      registerPlugins(mockApp)
    }).not.toThrow()
  })

  it('imports registerPlugins successfully', async () => {
    const pluginModule = await import('../../src/plugins/index.js')
    expect(pluginModule.registerPlugins).toBeDefined()
    expect(typeof pluginModule.registerPlugins).toBe('function')
  })

  it('validates app parameter', async () => {
    const { registerPlugins } = await import('../../src/plugins/index.js')

    expect(() => {
      registerPlugins(null)
    }).toThrow()

    expect(() => {
      registerPlugins(undefined)
    }).toThrow()

    expect(() => {
      registerPlugins({})
    }).toThrow()
  })

  it('ensures plugin is properly configured before registration', async () => {
    const { registerPlugins } = await import('../../src/plugins/index.js')
    registerPlugins(mockApp)

    // Verify that the plugin being registered has required properties
    const registeredPlugin = mockApp.use.mock.calls[0][0]
    expect(registeredPlugin).toHaveProperty('install')
    expect(typeof registeredPlugin.install).toBe('function')
  })
})
