import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

// Моки ДОЛЖНЫ быть в самом начале, до любых импортов
vi.mock('../src/styles/main.css', () => ({}))

const mockApp = {
  use: vi.fn().mockReturnThis(),
  component: vi.fn().mockReturnThis(),
  mount: vi.fn().mockReturnThis()
}

const mockCreateApp = vi.fn(() => mockApp)

vi.mock('vue', () => ({
  createApp: mockCreateApp
}))

vi.mock('../src/App.vue', () => ({
  default: { name: 'App' }
}))

const mockRegisterPlugins = vi.fn()
vi.mock('@/plugins', () => ({
  registerPlugins: mockRegisterPlugins
}))

// Также попробуем замокать по относительному пути
vi.mock('../src/plugins', () => ({
  registerPlugins: mockRegisterPlugins
}))

vi.mock('../src/plugins/index.js', () => ({
  registerPlugins: mockRegisterPlugins
}))

const mockVueApexCharts = { name: 'VueApexCharts' }
vi.mock('vue3-apexcharts', () => ({
  default: mockVueApexCharts
}))

const mockVueDatePicker = { name: 'VueDatePicker' }
vi.mock('@vuepic/vue-datepicker', () => ({
  default: mockVueDatePicker
}))

// Mock import.meta.env используя vi.stubGlobal
const mockEnv = { MODE: 'development' }

describe('main.js', () => {
  let consoleSpy
  let consoleErrorSpy

  beforeEach(() => {
    vi.clearAllMocks()
    consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    // Mock import.meta.env для каждого теста
    vi.stubGlobal('import', {
      meta: {
        env: mockEnv
      }
    })
  })

  afterEach(() => {
    consoleSpy.mockRestore()
    consoleErrorSpy.mockRestore()
    vi.unstubAllGlobals()
  })

  it('initializes Vue application correctly', async () => {
    // Импортируем реальный main.js - это запустит код инициализации
    await import('../src/main.js')

    expect(mockCreateApp).toHaveBeenCalledWith(expect.objectContaining({
      name: 'App'
    }))
  })

  it('registers VueApexCharts plugin', async () => {
    vi.resetModules()
    await import('../src/main.js')

    expect(mockApp.use).toHaveBeenCalledWith(mockVueApexCharts)
  })

  it('registers VueDatePicker component', async () => {
    vi.resetModules()
    await import('../src/main.js')

    expect(mockApp.component).toHaveBeenCalledWith('VueDatePicker', mockVueDatePicker)
  })

  it('calls registerPlugins', async () => {
    vi.resetModules()
    await import('../src/main.js')

    expect(mockRegisterPlugins).toHaveBeenCalledWith(mockApp)
  })

  it('mounts application to #main', async () => {
    vi.resetModules()
    await import('../src/main.js')

    expect(mockApp.mount).toHaveBeenCalledWith('#main')
  })

  it('logs success message in development mode', async () => {
    vi.stubEnv('MODE', 'development')

    vi.resetModules()
    await import('../src/main.js')

    expect(consoleSpy).toHaveBeenCalledWith('Application successfully mounted in development mode')
  })

  it('does not log in production mode', async () => {
    vi.stubEnv('MODE', 'production')

    vi.resetModules()
    await import('../src/main.js')

    expect(consoleSpy).not.toHaveBeenCalledWith('Application successfully mounted in development mode')
  })

  it('handles createApp errors gracefully', async () => {
    mockCreateApp.mockImplementationOnce(() => {
      throw new Error('CreateApp failed')
    })

    vi.resetModules()
    await import('../src/main.js')

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Failed to initialize application:',
      expect.any(Error)
    )
  })

  it('handles mount errors gracefully', async () => {
    mockApp.mount.mockImplementationOnce(() => {
      throw new Error('Mount failed')
    })

    vi.resetModules()
    await import('../src/main.js')

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Failed to initialize application:',
      expect.any(Error)
    )
  })

  it('handles registerPlugins errors gracefully', async () => {
    mockRegisterPlugins.mockImplementationOnce(() => {
      throw new Error('Plugin registration failed')
    })

    vi.resetModules()
    await import('../src/main.js')

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Failed to initialize application:',
      expect.any(Error)
    )
  })

  it('executes initialization steps in correct order', async () => {
    const callOrder = []

    mockCreateApp.mockImplementationOnce(() => {
      callOrder.push('createApp')
      return mockApp
    })

    mockApp.use.mockImplementationOnce(() => {
      callOrder.push('use-apexcharts')
      return mockApp
    })

    mockApp.component.mockImplementationOnce(() => {
      callOrder.push('component-datepicker')
      return mockApp
    })

    mockRegisterPlugins.mockImplementationOnce(() => {
      callOrder.push('registerPlugins')
    })

    mockApp.mount.mockImplementationOnce(() => {
      callOrder.push('mount')
      return mockApp
    })

    vi.resetModules()
    await import('../src/main.js')

    expect(callOrder).toEqual([
      'createApp',
      'use-apexcharts',
      'component-datepicker',
      'registerPlugins',
      'mount'
    ])
  })
})
