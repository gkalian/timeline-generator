import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import AppFooter from '../../src/components/AppFooter.vue'

// Mock CSS imports
vi.mock('*.css', () => ({}))

describe('AppFooter.vue', () => {
  let wrapper

  const createWrapper = () => {
    return mount(AppFooter, {
      global: {
        stubs: {
          'v-footer': {
            template: '<footer class="v-footer" v-bind="$attrs"><slot /></footer>',
            inheritAttrs: false
          }
        }
      }
    })
  }

  beforeEach(() => {
    // Mock Date to have consistent year in tests
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-01-01'))
  })

  afterEach(() => {
    vi.useRealTimers()
    if (wrapper) {
      wrapper.unmount()
    }
  })

  it('renders the footer structure correctly', () => {
    wrapper = createWrapper()

    expect(wrapper.find('.v-footer').exists()).toBe(true)
    expect(wrapper.find('.footer').exists()).toBe(true)
    expect(wrapper.find('.footer-text').exists()).toBe(true)
  })

  it('displays the author link correctly', () => {
    wrapper = createWrapper()

    const authorLink = wrapper.find('.author-link')
    expect(authorLink.exists()).toBe(true)
    expect(authorLink.attributes('href')).toBe('https://github.com/gkalian')
    expect(authorLink.attributes('target')).toBe('_blank')
    expect(authorLink.attributes('rel')).toBe('noopener noreferrer')
    expect(authorLink.text()).toBe('gkalian')
  })

  it('displays the current year in copyright', () => {
    wrapper = createWrapper()

    const footerText = wrapper.find('.footer-text')
    expect(footerText.text()).toContain('2024')
    expect(footerText.text()).toContain('©')
  })

  it('has correct footer classes and attributes', () => {
    wrapper = createWrapper()

    const footer = wrapper.find('.v-footer')
    expect(footer.classes()).toContain('footer')
  })

  it('contains proper text structure', () => {
    wrapper = createWrapper()

    const footerText = wrapper.find('.footer-text')
    const expectedPattern = /gkalian,\s*©\s*\d{4}/
    expect(footerText.text()).toMatch(expectedPattern)
  })

  it('author link opens in new tab with security attributes', () => {
    wrapper = createWrapper()

    const authorLink = wrapper.find('.author-link')
    expect(authorLink.attributes('target')).toBe('_blank')
    expect(authorLink.attributes('rel')).toBe('noopener noreferrer')
  })

  it('has correct CSS classes for styling', () => {
    wrapper = createWrapper()

    expect(wrapper.find('.footer').exists()).toBe(true)
    expect(wrapper.find('.footer-text').exists()).toBe(true)
    expect(wrapper.find('.author-link').exists()).toBe(true)
  })

  it('dynamically calculates the current year', () => {
    // Test with different year
    vi.setSystemTime(new Date('2025-06-15'))
    wrapper = createWrapper()

    const footerText = wrapper.find('.footer-text')
    expect(footerText.text()).toContain('2025')
  })

  it('has proper div structure with text-center class', () => {
    wrapper = createWrapper()

    const textDiv = wrapper.find('.text-center')
    expect(textDiv.exists()).toBe(true)
    expect(textDiv.classes()).toContain('mt-2')
    expect(textDiv.classes()).toContain('footer-text')
  })

  it('maintains text content structure', () => {
    wrapper = createWrapper()

    const footerText = wrapper.find('.footer-text')
    const content = footerText.text()

    // Check that it contains the author name
    expect(content).toContain('gkalian')
    // Check that it contains copyright symbol
    expect(content).toContain('©')
    // Check that it contains a year (4 digits)
    expect(content).toMatch(/\d{4}/)
    // Check the overall structure: "gkalian, © YEAR"
    expect(content).toMatch(/gkalian,\s*©\s*\d{4}/)
  })

  it('renders without any JavaScript errors', () => {
    expect(() => {
      wrapper = createWrapper()
    }).not.toThrow()
  })

  it('has proper HTML semantic structure', () => {
    wrapper = createWrapper()

    // Footer should be the root element
    expect(wrapper.find('footer').exists()).toBe(true)

    // Should have a div with proper classes
    const contentDiv = wrapper.find('.footer-text')
    expect(contentDiv.exists()).toBe(true)

    // Should have a link element
    const link = wrapper.find('a')
    expect(link.exists()).toBe(true)
  })
})
