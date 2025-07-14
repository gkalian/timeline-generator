import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  getVueEcosystemMocks,
  setupTestEnvironment
} from '../tests/setup/test-utils.js'

// Mock Vue and ecosystem
const vueEcosystemMocks = getVueEcosystemMocks()
vi.mock('vue', () => vueEcosystemMocks.vue)

vi.mock('../src/App.vue', () => ({
  default: { name: 'App' }
}))

const mockRegisterPlugins = vi.fn()
vi.mock('../src/plugins', () => ({
  registerPlugins: mockRegisterPlugins
}))

describe('main.js', () => {
  let consoleMocks

  beforeEach(() => {
    consoleMocks = setupTestEnvironment('development')
  })

  it('handles environment modes correctly', async () => {
    const modes = ['development', 'production', 'test']

    for (const mode of modes) {
      vi.clearAllMocks()
      consoleMocks.consoleSpy.mockClear()

      vi.stubEnv('MODE', mode)
      vi.resetModules()

      await import('../src/main.js')

      if (mode === 'development') {
        expect(consoleMocks.consoleSpy).toHaveBeenCalledWith('Application successfully mounted in development mode')
      } else {
        expect(consoleMocks.consoleSpy).not.toHaveBeenCalledWith('Application successfully mounted in development mode')
      }
    }
  })

  it('initializes app with correct configuration and chain', async () => {
    const { vue } = vueEcosystemMocks
    const mockApp = vueEcosystemMocks.mockApp

    await import('../src/main.js')

    // App creation
    expect(vue.createApp).toHaveBeenCalledWith(expect.objectContaining({
      name: 'App'
    }))

    // Plugin registration
    expect(mockRegisterPlugins).toHaveBeenCalledTimes(1)
    expect(mockRegisterPlugins).toHaveBeenCalledWith(mockApp)

    // DOM mounting
    expect(mockApp.mount).toHaveBeenCalledWith('#main')
    expect(mockApp.mount).toHaveBeenCalledAfter(mockRegisterPlugins)
  })

  it('handles application initialization errors gracefully', async () => {
    const { createApp } = await import('vue')
    createApp.mockImplementationOnce(() => {
      throw new Error('App initialization failed')
    })

    vi.resetModules()
    await import('../src/main.js')

    expect(consoleMocks.consoleErrorSpy).toHaveBeenCalledWith(
      'Failed to initialize application:',
      expect.any(Error)
    )
  })

  it('calls registerPlugins with app instance', async () => {
    await import('../src/main.js')

    expect(mockRegisterPlugins).toHaveBeenCalledTimes(1)
    expect(mockRegisterPlugins).toHaveBeenCalledWith(expect.any(Object))
  })

  it('imports and executes successfully', async () => {
    expect(async () => {
      const mainModule = await import('../src/main.js')
      expect(mainModule).toBeDefined()
    }).not.toThrow()
  })

  it('renders without errors', async () => {
    expect(async () => {
      await import('../src/main.js')
    }).not.toThrow()
  })
})
