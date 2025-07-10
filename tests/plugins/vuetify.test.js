import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

// Mock CSS imports
vi.mock('vuetify/styles', () => ({}))
vi.mock('@vuepic/vue-datepicker/dist/main.css', () => ({}))

// Mock createVuetify function
const mockVuetifyInstance = {
  install: vi.fn(),
  theme: {
    defaultTheme: 'dark'
  }
}

const mockCreateVuetify = vi.fn(() => mockVuetifyInstance)

vi.mock('vuetify', () => ({
  createVuetify: mockCreateVuetify
}))

describe('vuetify.js', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Reset module cache to ensure fresh imports
    vi.resetModules()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should import required CSS files without errors', async () => {
    // Since CSS imports are mocked, we just verify the module can be imported
    // without throwing errors related to CSS imports
    await expect(import('../../src/plugins/vuetify.js')).resolves.toBeDefined()
  })

  it('should create vuetify instance with correct configuration', async () => {
    // Import the vuetify plugin
    const vuetifyPlugin = await import('../../src/plugins/vuetify.js')

    expect(mockCreateVuetify).toHaveBeenCalledWith({
      theme: {
        defaultTheme: 'dark'
      }
    })

    expect(vuetifyPlugin.default).toBe(mockVuetifyInstance)
  })

  it('should export vuetify instance as default', async () => {
    const vuetifyPlugin = await import('../../src/plugins/vuetify.js')

    expect(vuetifyPlugin.default).toBeDefined()
    expect(vuetifyPlugin.default).toBe(mockVuetifyInstance)
  })

  it('should configure dark theme as default', async () => {
    // Import the vuetify plugin to trigger createVuetify call
    await import('../../src/plugins/vuetify.js')

    // Verify that createVuetify was called at least once
    expect(mockCreateVuetify).toHaveBeenCalled()

    const callArgs = mockCreateVuetify.mock.calls[0][0]
    expect(callArgs.theme.defaultTheme).toBe('dark')
  })

  it('should have correct theme configuration structure', async () => {
    // Import the vuetify plugin to trigger createVuetify call
    await import('../../src/plugins/vuetify.js')

    // Verify that createVuetify was called at least once
    expect(mockCreateVuetify).toHaveBeenCalled()

    const callArgs = mockCreateVuetify.mock.calls[0][0]
    expect(callArgs).toHaveProperty('theme')
    expect(callArgs.theme).toHaveProperty('defaultTheme')
    expect(typeof callArgs.theme.defaultTheme).toBe('string')
  })

  it('should call createVuetify when module is imported', async () => {
    // Import the vuetify plugin
    await import('../../src/plugins/vuetify.js')

    expect(mockCreateVuetify).toHaveBeenCalledTimes(1)
  })

  it('should export an object with install method', async () => {
    const vuetifyPlugin = await import('../../src/plugins/vuetify.js')

    expect(vuetifyPlugin.default).toBeTypeOf('object')
    expect(vuetifyPlugin.default.install).toBeTypeOf('function')
  })

  it('should pass correct configuration object to createVuetify', async () => {
    await import('../../src/plugins/vuetify.js')

    const expectedConfig = {
      theme: {
        defaultTheme: 'dark'
      }
    }

    expect(mockCreateVuetify).toHaveBeenCalledWith(expectedConfig)
  })

  it('should create vuetify instance with dark theme configuration', async () => {
    const vuetifyPlugin = await import('../../src/plugins/vuetify.js')

    // Verify the exported instance has the expected structure
    expect(vuetifyPlugin.default).toBe(mockVuetifyInstance)
    expect(vuetifyPlugin.default.theme.defaultTheme).toBe('dark')
  })
})
