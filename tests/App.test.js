import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import App from '../src/App.vue'
import {
  getVuetifyStubs,
  createComponentWrapper,
  expectComponentToExist,
  expectStandardComponentBehavior,
} from '../tests/setup/test-utils.js'

// УБИРАЕМ vi.mock - используем только stubs
describe('App.vue', () => {
  let wrapper

  const createWrapper = (options = {}) => {
    return createComponentWrapper(App, mount, {
      ...options,
      global: {
        stubs: {
          ...getVuetifyStubs(),
          // Только stubs для дочерних компонентов
          AppMain: {
            name: 'AppMain',
            template: '<div data-testid="app-main">AppMain Content</div>'
          },
          AppFooter: {
            name: 'AppFooter',
            template: '<div data-testid="app-footer">AppFooter Content</div>'
          }
        },
        ...options.global
      }
    })
  }

  it('renders main app structure', () => {
    wrapper = createWrapper()

    expectStandardComponentBehavior(wrapper)
    expect(wrapper.find('.v-application').exists()).toBe(true)
    expect(wrapper.find('.v-main').exists()).toBe(true)
  })

  it('renders child components', () => {
    wrapper = createWrapper()

    expectComponentToExist(wrapper, 'app-main')
    expectComponentToExist(wrapper, 'app-footer')
  })

  it('maintains proper component hierarchy', () => {
    wrapper = createWrapper()

    const vApp = wrapper.find('.v-application')
    const vMain = wrapper.find('.v-main')
    const appMain = wrapper.find('[data-testid="app-main"]')
    const appFooter = wrapper.find('[data-testid="app-footer"]')

    expect(vApp.exists()).toBe(true)
    expect(vMain.exists()).toBe(true)
    expect(appMain.exists()).toBe(true)
    expect(appFooter.exists()).toBe(true)
  })

  it('renders without errors', () => {
    expect(() => {
      wrapper = createWrapper()
    }).not.toThrow()
  })
})
