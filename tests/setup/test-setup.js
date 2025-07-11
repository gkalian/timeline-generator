// tests/setup/test-setup.js
import { vi, beforeEach, afterEach } from 'vitest'
import { setupTestEnvironment, cleanupTestEnvironment, safeUnmount } from '../setup/test-utils.js'

// Global CSS and ecosystem mocks - must be at top level
vi.mock('*.css', () => ({}))
vi.mock('vuetify/styles', () => ({}))
vi.mock('@vuepic/vue-datepicker/dist/main.css', () => ({}))
vi.mock('vue3-apexcharts', () => ({
  default: { name: 'VueApexCharts' }
}))
vi.mock('@vuepic/vue-datepicker', () => ({
  default: {
    name: 'VueDatePicker',
    template: `
      <div
        data-testid="vue-datepicker-mock"
        :data-month-picker="monthPicker"
        :data-position="position"
        :data-teleport="teleport"
      >
        <slot name="trigger"></slot>
        <div v-if="showPicker" data-testid="datepicker-popup">DatePicker Popup</div>
      </div>
    `,
    props: {
      monthPicker: { type: Boolean, default: false },
      position: { type: String, default: 'auto' },
      teleport: { type: [Boolean, String], default: true }
    },
    emits: ['update:modelValue'],
    data() {
      return { showPicker: false }
    },
    methods: {
      triggerUpdate(value) {
        this.$emit('update:modelValue', value)
      }
    }
  }
}))

// Global setup for each test
beforeEach(() => {
  vi.clearAllMocks()
  vi.resetModules()

  document.body.innerHTML = ''
  setupTestEnvironment()

})

afterEach(() => {
  let wrapper

  vi.clearAllMocks()
  safeUnmount(wrapper);
  cleanupTestEnvironment()
})
