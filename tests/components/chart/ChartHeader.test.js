import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import ChartHeader from '../../../src/components/chart/ChartHeader.vue'
import {
  getVuetifyStubs,
  createComponentWrapper,
  expectStandardComponentBehavior,
} from '../../setup/test-utils.js'

// Mock helper functions
vi.mock('../../../src/helper/utils.js', () => ({
  saveInputRows: vi.fn(),
  saveChartSettings: vi.fn(),
  handleFileLoad: vi.fn(() => ({
    rows: [{ name: 'Test', comment: '', startTime: '01.2024', endTime: '12.2024' }],
    chartTitle: 'Test Title',
    chartHeight: '500',
    chartWidth: '1000'
  }))
}))

describe('ChartHeader.vue', () => {
  let wrapper

  const mockInputRows = [
    { name: 'Project 1', comment: '', startTime: '01.2024', endTime: '06.2024' },
    { name: 'Project 2', comment: '', startTime: '07.2024', endTime: '12.2024' }
  ]

  const createWrapper = (props = {}) => {
    return createComponentWrapper(ChartHeader, mount, {
      props: {
        modelValue: mockInputRows,
        title: 'Test Timeline',
        height: '400',
        width: '900',
        inputRows: mockInputRows,
        ...props
      },
      global: {
        stubs: {
          ...getVuetifyStubs(),
          'v-col': {
            template: '<div class="v-col" v-bind="$attrs"><slot /></div>',
            inheritAttrs: false
          }
        }
      }
    })
  }

  beforeEach(() => {
    vi.clearAllMocks()
    if (wrapper) {
      wrapper.unmount()
    }
  })

  it('renders header structure correctly', () => {
    wrapper = createWrapper()

    expectStandardComponentBehavior(wrapper)
    expect(wrapper.find('.chart-container-settings').exists()).toBe(true)
    expect(wrapper.findAllComponents({ name: 'v-text-field' })).toHaveLength(3)
    expect(wrapper.findAllComponents({ name: 'v-btn' })).toHaveLength(6)
  })

  it('displays input fields with correct values', () => {
    wrapper = createWrapper()

    const textFields = wrapper.findAllComponents({ name: 'v-text-field' })
    expect(textFields[0].props('modelValue')).toBe('Test Timeline')
    expect(textFields[0].props('label')).toBe('Title')
    expect(textFields[1].props('modelValue')).toBe('400')
    expect(textFields[1].props('label')).toBe('Height (px)')
    expect(textFields[2].props('modelValue')).toBe('900')
    expect(textFields[2].props('label')).toBe('Width (px)')
  })

  it('renders action buttons with correct icons', () => {
    wrapper = createWrapper()

    const buttons = wrapper.findAllComponents({ name: 'v-btn' })
    const icons = wrapper.findAllComponents({ name: 'v-icon' })

    expect(buttons).toHaveLength(6)
    expect(icons).toHaveLength(6)

    // Check specific icons
    expect(icons[0].text()).toBe('mdi-plus-thick')      // Add
    expect(icons[1].text()).toBe('mdi-minus-thick')     // Remove
    expect(icons[2].text()).toBe('mdi-close-thick')     // Clear
    expect(icons[3].text()).toBe('mdi-upload')          // Upload
    expect(icons[4].text()).toBe('mdi-download')        // Download
    expect(icons[5].text()).toBe('mdi-cog')             // Settings
  })

  it('has validation rules defined', () => {
    wrapper = createWrapper()

    expect(wrapper.vm.rules).toBeDefined()
    expect(wrapper.vm.rules.chartRequiredRule).toBeTypeOf('function')
    expect(wrapper.vm.rules.chartRequiredRule('test')).toBe(true)
    expect(wrapper.vm.rules.chartRequiredRule('')).toBe('Field is required')
  })

  it('emits correct events when update methods are called', () => {
    wrapper = createWrapper()

    wrapper.vm.updateTitle('New Title')
    wrapper.vm.updateHeight('500')
    wrapper.vm.updateWidth('1200')

    expect(wrapper.emitted('update:title')).toBeTruthy()
    expect(wrapper.emitted('update:title')[0]).toEqual(['New Title'])
    expect(wrapper.emitted('update:height')).toBeTruthy()
    expect(wrapper.emitted('update:height')[0]).toEqual(['500'])
    expect(wrapper.emitted('update:width')).toBeTruthy()
    expect(wrapper.emitted('update:width')[0]).toEqual(['1200'])
  })

  it('emits action events when button methods are called', () => {
    wrapper = createWrapper()

    wrapper.vm.addRow()
    wrapper.vm.removeRows()
    wrapper.vm.clearAll()

    expect(wrapper.emitted('add-row')).toBeTruthy()
    expect(wrapper.emitted('remove-rows')).toBeTruthy()
    expect(wrapper.emitted('clear-all')).toBeTruthy()
  })

  it('has correct button titles for accessibility', () => {
    wrapper = createWrapper()

    const buttons = wrapper.findAllComponents({ name: 'v-btn' })
    expect(buttons[0].attributes('title')).toBe('Add row')
    expect(buttons[1].attributes('title')).toBe('Remove row')
    expect(buttons[2].attributes('title')).toBe('Clear all')
    expect(buttons[3].attributes('title')).toBe('Upload data')
    expect(buttons[4].attributes('title')).toBe('Download data')
    expect(buttons[5].attributes('title')).toBe('Settings')
  })

  it('has uploadData and downloadData methods', () => {
    wrapper = createWrapper()

    expect(wrapper.vm.uploadData).toBeTypeOf('function')
    expect(wrapper.vm.downloadData).toBeTypeOf('function')
  })

  it('initializes with correct default local values', () => {
    wrapper = createWrapper()

    expect(wrapper.vm.localTitle).toBe('Test Timeline')
    expect(wrapper.vm.localHeight).toBe('400')
    expect(wrapper.vm.localWidth).toBe('900')
  })

  it('renders without errors', () => {
    expect(() => {
      wrapper = createWrapper()
    }).not.toThrow()
  })
})
