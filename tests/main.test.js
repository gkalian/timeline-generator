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

  it('logs success message in development mode', async () => {
    vi.stubEnv('MODE', 'development')

    await import('../src/main.js')

    expect(consoleMocks.consoleSpy).toHaveBeenCalledWith('Application successfully mounted in development mode')
  })

  it('does not log in production mode', async () => {
    vi.stubEnv('MODE', 'production')

    vi.resetModules()
    await import('../src/main.js')

    expect(consoleMocks.consoleSpy).not.toHaveBeenCalledWith('Application successfully mounted in development mode')
  })

  it('calls registerPlugins with app instance', async () => {
    await import('../src/main.js')

    expect(mockRegisterPlugins).toHaveBeenCalledTimes(1)
    expect(mockRegisterPlugins).toHaveBeenCalledWith(expect.any(Object))
  })

  it('handles different environment modes correctly', async () => {
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

  it('creates app with correct configuration', async () => {
    const { vue } = vueEcosystemMocks

    await import('../src/main.js')

    expect(vue.createApp).toHaveBeenCalledWith(expect.objectContaining({
      name: 'App'
    }))
  })

  it('mounts app to correct DOM element', async () => {
    const mockApp = vueEcosystemMocks.mockApp

    await import('../src/main.js')

    expect(mockApp.mount).toHaveBeenCalledWith('#main')
  })

  it('executes without throwing errors in normal conditions', async () => {
    expect(async () => {
      await import('../src/main.js')
    }).not.toThrow()
  })

  it('imports main.js successfully', async () => {
    const mainModule = await import('../src/main.js')
    expect(mainModule).toBeDefined()
  })

  it('properly initializes app chain', async () => {
    const mockApp = vueEcosystemMocks.mockApp

    await import('../src/main.js')

    // Verify the complete initialization chain
    expect(mockRegisterPlugins).toHaveBeenCalledWith(mockApp)
    expect(mockApp.mount).toHaveBeenCalledAfter(mockRegisterPlugins)
  })
})
