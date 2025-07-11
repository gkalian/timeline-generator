// tests/utils/test-utils.js
import { vi, expect } from 'vitest'

/**
 * Common Vuetify stubs
 */
export const getVuetifyStubs = () => ({
  'v-app': {
    template: '<div class="v-application"><slot /></div>'
  },
  'v-main': {
    template: '<div class="v-main"><slot /></div>'
  },
  'v-container': {
    template: '<div class="v-container"><slot /></div>'
  },
  'v-responsive': {
    template: '<div class="v-responsive" v-bind="$attrs"><slot /></div>',
    inheritAttrs: false
  },
  'v-row': {
    template: '<div class="v-row"><slot /></div>'
  },
  'v-footer': {
    template: '<footer class="v-footer" v-bind="$attrs"><slot /></footer>',
    inheritAttrs: false
  },
  'v-text-field': {
    name: 'v-text-field',
    template: `
      <div class="v-text-field-mock" data-testid="v-text-field">
        <label :for="inputId" data-testid="field-label">{{ label }}</label>
        <input
          :id="inputId"
          :value="modelValue"
          :readonly="readonly"
          :aria-label="label"
          @input="$emit('update:modelValue', $event.target.value)"
          data-testid="text-field-input"
        />
        <div class="v-field__append-inner" data-testid="append-inner">
          <slot name="append-inner"></slot>
        </div>
      </div>
    `,
    props: {
      modelValue: { type: String, default: '' },
      label: { type: String, default: '' },
      readonly: { type: Boolean, default: false },
      variant: { type: String, default: '' },
      clearable: { type: Boolean, default: false },
      required: { type: Boolean, default: false },
      rules: { type: Array, default: () => [] }
    },
    emits: ['update:modelValue'],
    computed: {
      inputId() {
        return `input-${Math.random().toString(36).substr(2, 9)}`
      }
    }
  },
  'v-btn': {
    name: 'v-btn',
    template: `
      <button
        class="v-btn-mock"
        v-bind="$attrs"
        :aria-label="ariaLabel || 'Button'"
        @click="$emit('click', $event)"
        data-testid="v-btn"
      >
        <slot></slot>
      </button>
    `,
    props: ['icon', 'variant', 'ariaLabel'],
    emits: ['click']
  },
  'v-icon': {
    name: 'v-icon',
    template: '<span class="v-icon-mock" data-testid="v-icon"><slot></slot></span>',
    props: []
  }
})

/**
 * Component mocks for specific components
 */
export const getComponentMocks = () => ({
  InputFieldsRow: {
    name: 'InputFieldsRow',
    template: '<div data-testid="input-fields-row" v-bind="$attrs">InputFieldsRow</div>',
    props: ['modelValue'],
    emits: ['update:modelValue']
  },
  ChartHeader: {
    name: 'ChartHeader',
    template: '<div data-testid="chart-header" v-bind="$attrs">ChartHeader</div>',
    props: ['modelValue', 'title', 'height', 'width'],
    emits: ['update:modelValue', 'update:title', 'update:height', 'update:width', 'add-row', 'remove-rows', 'clear-all', 'toggle-new-row']
  },
  ChartContainer: {
    name: 'ChartContainer',
    template: '<div data-testid="chart-container" v-bind="$attrs">ChartContainer</div>',
    props: ['inputRows', 'title', 'height', 'width', 'showNewRow']
  }
})

/**
 * Vue ecosystem mocks
 */
export const getVueEcosystemMocks = () => {
  const mockApp = {
    use: vi.fn().mockReturnThis(),
    component: vi.fn().mockReturnThis(),
    mount: vi.fn().mockReturnThis()
  }

  const mockCreateApp = vi.fn(() => mockApp)

  return {
    vue: {
      createApp: mockCreateApp
    },
    vuetify: {
      createVuetify: vi.fn(() => ({
        install: vi.fn(),
        theme: { defaultTheme: 'dark' }
      }))
    },
    mockApp
  }
}

/**
 * Standardized test environment setup
 */
export const setupTestEnvironment = (mode = 'test') => {
  const consoleMocks = setupConsoleMocks()
  setupFixedTime()

  vi.stubGlobal('import', {
    meta: {
      env: { MODE: mode }
    }
  })

  return consoleMocks
}

/**
 * Standardized test environment cleanup
 */
export const cleanupTestEnvironment = (consoleMocks = null) => {
  if (consoleMocks) {
    cleanupConsoleMocks(consoleMocks.consoleSpy, consoleMocks.consoleErrorSpy)
  }
  cleanupTimeMocks()
  vi.unstubAllGlobals()
  vi.unstubAllEnvs()
}

/**
 * Console mocks setup
 */
export const setupConsoleMocks = () => {
  const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
  const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

  return { consoleSpy, consoleErrorSpy }
}

/**
 * Console mocks cleanup
 */
export const cleanupConsoleMocks = (consoleSpy, consoleErrorSpy) => {
  consoleSpy?.mockRestore()
  consoleErrorSpy?.mockRestore()
}

/**
 * Fixed time setup for tests
 */
export const setupFixedTime = (date = '2024-01-01') => {
  vi.useFakeTimers()
  vi.setSystemTime(new Date(date))
}

/**
 * Time mocks cleanup
 */
export const cleanupTimeMocks = () => {
  vi.useRealTimers()
}

/**
 * Component existence checks
 */
export const expectComponentToExist = (wrapper, testId) => {
  expect(wrapper.find(`[data-testid="${testId}"]`).exists()).toBe(true)
}

export const expectComponentsToExist = (wrapper, testIds) => {
  testIds.forEach(testId => expectComponentToExist(wrapper, testId))
}

/**
 * Component props validation
 */
export const expectComponentProps = (wrapper, componentName, expectedProps) => {
  const component = wrapper.findComponent({ name: componentName })
  expect(component.exists()).toBe(true)

  if (expectedProps) {
    const props = component.props()
    Object.keys(expectedProps).forEach(key => {
      expect(props[key]).toBe(expectedProps[key])
    })
  }

  return component
}

/**
 * Real component interaction testing (instead of artificial emit testing)
 */
export const triggerComponentEvent = async (wrapper, selector, event, payload = null) => {
  const element = wrapper.find(selector)
  expect(element.exists()).toBe(true)

  if (payload) {
    await element.trigger(event, payload)
  } else {
    await element.trigger(event)
  }

  return element
}

/**
 * Safe component unmounting
 */
export const safeUnmount = (wrapper) => {
  if (wrapper) {
    try {
      wrapper.unmount()
    } catch (error) {
      console.warn('Error unmounting wrapper:', error.message)
    }
  }
}

/**
 * Standard component behavior validation
 */
export const expectStandardComponentBehavior = (wrapper, componentName = null) => {
  expect(wrapper.exists()).toBe(true)
  if (componentName) {
    expect(wrapper.findComponent({ name: componentName }).exists()).toBe(true)
  }
}

/**
 * Accessibility checks
 */
export const expectAccessibility = (wrapper) => {
  const buttons = wrapper.findAll('button')
  buttons.forEach(button => {
    const hasAccessibleLabel = button.attributes('aria-label') ||
                              button.text().trim() ||
                              button.find('[aria-label]').exists()
    expect(hasAccessibleLabel).toBeTruthy()
  })

  const inputs = wrapper.findAll('input')
  inputs.forEach(input => {
    const hasLabel = input.attributes('aria-label') ||
                    input.attributes('id') && wrapper.find(`label[for="${input.attributes('id')}"]`).exists()
    expect(hasLabel).toBeTruthy()
  })
}

/**
 * Component wrapper factory
 */
export const createComponentWrapper = (Component, mount, options = {}) => {
  const defaultOptions = {
    props: {},
    global: {
      stubs: getVuetifyStubs()
    }
  }

  return mount(Component, {
    ...defaultOptions,
    ...options,
    props: { ...defaultOptions.props, ...options.props },
    global: {
      ...defaultOptions.global,
      ...options.global,
      stubs: {
        ...defaultOptions.global.stubs,
        ...options.global?.stubs
      }
    }
  })
}
