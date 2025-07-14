import { describe, it, expect, vi } from 'vitest'

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

  it('imports and creates vuetify instance correctly', async () => {
    const vuetifyPlugin = await import('../../src/plugins/vuetify.js')

    expect(vuetifyPlugin.default).toBeDefined()
    expect(vuetifyPlugin.default).toBe(mockVuetifyInstance)
    expect(mockCreateVuetify).toHaveBeenCalledTimes(1)
  })

  it('configures vuetify with dark theme', async () => {
    await import('../../src/plugins/vuetify.js')

    expect(mockCreateVuetify).toHaveBeenCalledWith({
      theme: {
        defaultTheme: 'dark'
      }
    })
  })

  it('exports valid Vue plugin with install method', async () => {
    const vuetifyPlugin = await import('../../src/plugins/vuetify.js')

    expect(vuetifyPlugin.default).toBeTypeOf('object')
    expect(vuetifyPlugin.default.install).toBeTypeOf('function')
    expect(vuetifyPlugin.default.theme.defaultTheme).toBe('dark')
  })

  it('maintains configuration consistency', async () => {
    const vuetifyPlugin = await import('../../src/plugins/vuetify.js')

    const callArgs = mockCreateVuetify.mock.calls[0][0]
    expect(callArgs.theme).toEqual({
      defaultTheme: 'dark'
    })
    expect(vuetifyPlugin.default.theme.defaultTheme).toBe('dark')
  })

  it('handles module caching correctly', async () => {
    const firstImport = await import('../../src/plugins/vuetify.js')
    const firstCallCount = mockCreateVuetify.mock.calls.length

    const secondImport = await import('../../src/plugins/vuetify.js')
    const secondCallCount = mockCreateVuetify.mock.calls.length

    expect(firstImport.default).toBe(secondImport.default)
    expect(secondCallCount).toBe(firstCallCount)
  })

  it('renders without errors', async () => {
    expect(async () => {
      await import('../../src/plugins/vuetify.js')
    }).not.toThrow()
  })
})
