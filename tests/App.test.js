import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import App from '../src/App.vue'

// Mock CSS imports
vi.mock('*.css', () => ({}))

// Mock child components
vi.mock('../src/components/AppMain.vue', () => ({
  default: {
    name: 'AppMain',
    template: '<div data-testid="app-main">AppMain</div>'
  }
}))

vi.mock('../src/components/AppFooter.vue', () => ({
  default: {
    name: 'AppFooter',
    template: '<div data-testid="app-footer">AppFooter</div>'
  }
}))

describe('App.vue', () => {
  const createWrapper = () => {
    return mount(App, {
      global: {
        stubs: {
          'v-app': { template: '<div class="v-application"><slot /></div>' },
          'v-main': { template: '<div class="v-main"><slot /></div>' },
          AppMain: { template: '<div data-testid="app-main">AppMain</div>' },
          AppFooter: { template: '<div data-testid="app-footer">AppFooter</div>' }
        }
      }
    })
  }

  it('renders the main app structure', () => {
    const wrapper = createWrapper()

    expect(wrapper.find('.v-application').exists()).toBe(true)
    expect(wrapper.find('.v-main').exists()).toBe(true)
  })

  it('renders AppMain component', () => {
    const wrapper = createWrapper()

    expect(wrapper.find('[data-testid="app-main"]').exists()).toBe(true)
  })

  it('renders AppFooter component', () => {
    const wrapper = createWrapper()

    expect(wrapper.find('[data-testid="app-footer"]').exists()).toBe(true)
  })

  it('has correct component structure', () => {
    const wrapper = createWrapper()

    const vApp = wrapper.find('.v-application')
    const vMain = wrapper.find('.v-main')

    expect(vApp.exists()).toBe(true)
    expect(vMain.exists()).toBe(true)
    expect(vApp.find('.v-main').exists()).toBe(true)
  })
})
