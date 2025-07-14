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

  it('imports and registers vuetify plugin successfully', async () => {
    vi.stubEnv('MODE', 'production')

    const { registerPlugins } = await import('../../src/plugins/index.js')

    // Test imports successfully
    expect(registerPlugins).toBeDefined()
    expect(typeof registerPlugins).toBe('function')

    // Test registers plugin
    registerPlugins(mockApp)
    expect(mockApp.use).toHaveBeenCalledTimes(1)
    expect(mockApp.use).toHaveBeenCalledWith(expect.any(Object))
  })

  it('handles environment modes correctly', async () => {
    const testModes = ['development', 'production', 'test', 'staging']

    for (const mode of testModes) {
      vi.clearAllMocks()
      consoleMocks.consoleSpy.mockClear()
      vi.stubEnv('MODE', mode)
      vi.resetModules()

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

  it('handles plugin registration errors correctly', async () => {
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

  it('validates app parameter and ensures plugin configuration', async () => {
    const { registerPlugins } = await import('../../src/plugins/index.js')

    // Validates app parameter
    expect(() => {
      registerPlugins(null)
    }).toThrow()

    expect(() => {
      registerPlugins(undefined)
    }).toThrow()

    expect(() => {
      registerPlugins({})
    }).toThrow()

    // Test with valid app
    registerPlugins(mockApp)

    // Ensures plugin is properly configured
    const registeredPlugin = mockApp.use.mock.calls[0][0]
    expect(registeredPlugin).toHaveProperty('install')
    expect(typeof registeredPlugin.install).toBe('function')
  })

  it('handles development mode error scenarios', async () => {
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

  it('executes without errors in normal conditions', async () => {
    vi.stubEnv('MODE', 'test')

    const { registerPlugins } = await import('../../src/plugins/index.js')

    expect(() => {
      registerPlugins(mockApp)
    }).not.toThrow()

    expect(mockApp.use).toHaveBeenCalledTimes(1)
  })
})
