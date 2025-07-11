import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import AppFooter from '../../src/components/AppFooter.vue'
import {
  getVuetifyStubs,
  createComponentWrapper,
  expectStandardComponentBehavior,
} from '../setup/test-utils.js'

describe('AppFooter.vue', () => {
  let wrapper

  const createWrapper = () => {
    return createComponentWrapper(AppFooter, mount, {
      global: {
        stubs: {
          ...getVuetifyStubs(),
          'v-footer': {
            template: '<footer class="v-footer" v-bind="$attrs"><slot /></footer>',
            inheritAttrs: false
          }
        }
      }
    })
  }

  it('renders footer structure correctly', () => {
    wrapper = createWrapper()

    expectStandardComponentBehavior(wrapper)
    expect(wrapper.find('.v-footer').exists()).toBe(true)
    expect(wrapper.find('.footer-text').exists()).toBe(true)
    expect(wrapper.find('.author-link').exists()).toBe(true)
  })

  it('displays author link with correct attributes', () => {
    wrapper = createWrapper()

    const authorLink = wrapper.find('.author-link')
    expect(authorLink.attributes('href')).toBe('https://github.com/gkalian')
    expect(authorLink.attributes('target')).toBe('_blank')
    expect(authorLink.attributes('rel')).toBe('noopener noreferrer')
    expect(authorLink.text()).toBe('gkalian')
  })

  it('displays copyright with current year', () => {
    wrapper = createWrapper()

    const footerText = wrapper.find('.footer-text')
    const content = footerText.text()

    expect(content).toContain('gkalian')
    expect(content).toContain('©')
    expect(content).toContain(new Date().getFullYear().toString())
    expect(content).toMatch(/gkalian,\s*©\s*\d{4}/)
  })

  it('calculates year dynamically', () => {
    vi.setSystemTime(new Date('2025-06-15'))
    wrapper = createWrapper()

    const footerText = wrapper.find('.footer-text')
    expect(footerText.text()).toContain('2025')
  })

  it('has proper CSS classes and semantic structure', () => {
    wrapper = createWrapper()

    expect(wrapper.find('footer').exists()).toBe(true)
    expect(wrapper.find('.footer').exists()).toBe(true)
    expect(wrapper.find('.text-center').exists()).toBe(true)
    expect(wrapper.find('.mt-2').exists()).toBe(true)
  })

  it('renders without errors', () => {
    expect(() => {
      wrapper = createWrapper()
    }).not.toThrow()
  })
})
