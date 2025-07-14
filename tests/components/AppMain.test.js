import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import AppMain from '../../src/components/AppMain.vue'
import {
  getVuetifyStubs,
  createComponentWrapper,
  expectStandardComponentBehavior,
} from '../setup/test-utils.js'

// Mock the helper functions
vi.mock('../../src/helper/utils.js', () => ({
  saveInputRows: vi.fn(),
  saveChartSettings: vi.fn(),
  clearInputRows: vi.fn(),
  clearChartSettings: vi.fn(),
  loadChartSettings: vi.fn(() => null),
  loadInputRows: vi.fn()
}))

vi.mock('../../src/helper/chart.js', () => ({
  updateChartSeries: vi.fn()
}))

describe('AppMain.vue', () => {
  let wrapper

  const createWrapper = (props = {}) => {
    return createComponentWrapper(AppMain, mount, {
      props,
      global: {
        stubs: {
          ...getVuetifyStubs(),
          InputFieldsRow: {
            name: 'InputFieldsRow',
            template: '<div data-testid="input-fields-row">InputFieldsRow Mock</div>',
            props: ['modelValue'],
            emits: ['update:modelValue']
          },
          ChartHeader: {
            name: 'ChartHeader',
            template: '<div data-testid="chart-header">ChartHeader Mock</div>',
            props: ['modelValue', 'inputRows', 'title', 'height', 'width'],
            emits: ['update:modelValue', 'update:title', 'update:height', 'update:width', 'add-row', 'remove-rows', 'clear-all', 'toggle-new-row']
          },
          ChartContainer: {
            name: 'ChartContainer',
            template: '<div data-testid="chart-container">ChartContainer Mock</div>',
            props: ['inputRows', 'title', 'height', 'width', 'showNewRow']
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

  it('renders main structure correctly', () => {
    wrapper = createWrapper()

    expectStandardComponentBehavior(wrapper)
    expect(wrapper.find('.v-container').exists()).toBe(true)
    expect(wrapper.find('.main-container').exists()).toBe(true)
    expect(wrapper.find('.header').exists()).toBe(true)
  })

  it('renders all child components', () => {
    wrapper = createWrapper()

    expect(wrapper.find('[data-testid="input-fields-row"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="chart-header"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="chart-container"]').exists()).toBe(true)
  })

  it('initializes with correct default values', () => {
    wrapper = createWrapper()

    expect(wrapper.vm.title).toBe('Timeline')
    expect(wrapper.vm.height).toBe('400')
    expect(wrapper.vm.width).toBe('900')
    expect(wrapper.vm.showNewRow).toBe(false)
    expect(wrapper.vm.inputRows).toHaveLength(1)
    expect(wrapper.vm.inputRows[0]).toEqual({
      name: '', comment: '', startTime: '', endTime: ''
    })
  })

  it('addRow function adds new empty row', async () => {
    wrapper = createWrapper()

    const initialLength = wrapper.vm.inputRows.length
    wrapper.vm.addRow()

    expect(wrapper.vm.inputRows).toHaveLength(initialLength + 1)
    expect(wrapper.vm.inputRows[wrapper.vm.inputRows.length - 1]).toEqual({
      name: '', comment: '', startTime: '', endTime: ''
    })
  })

  it('removeRows function removes last row when multiple rows exist', async () => {
    wrapper = createWrapper()

    // Add some rows first
    wrapper.vm.addRow()
    wrapper.vm.addRow()
    expect(wrapper.vm.inputRows).toHaveLength(3)

    wrapper.vm.removeRows()
    expect(wrapper.vm.inputRows).toHaveLength(2)
  })

  it('removeRows function does not remove when only one row exists', async () => {
    wrapper = createWrapper()

    expect(wrapper.vm.inputRows).toHaveLength(1)
    wrapper.vm.removeRows()
    expect(wrapper.vm.inputRows).toHaveLength(1) // Should still be 1
  })

  it('clearAll function resets all data to defaults', async () => {
    wrapper = createWrapper()

    // Modify some data first
    wrapper.vm.addRow()
    wrapper.vm.addRow()
    wrapper.vm.title = 'Custom Title'
    wrapper.vm.height = '500'
    wrapper.vm.width = '1000'

    wrapper.vm.clearAll()

    expect(wrapper.vm.inputRows).toHaveLength(1)
    expect(wrapper.vm.inputRows[0]).toEqual({
      name: '', comment: '', startTime: '', endTime: ''
    })
    expect(wrapper.vm.title).toBe('Timeline')
    expect(wrapper.vm.height).toBe('400')
    expect(wrapper.vm.width).toBe('900')
  })

  it('toggleNewRow function toggles showNewRow state', async () => {
    wrapper = createWrapper()

    expect(wrapper.vm.showNewRow).toBe(false)
    wrapper.vm.toggleNewRow()
    expect(wrapper.vm.showNewRow).toBe(true)
    wrapper.vm.toggleNewRow()
    expect(wrapper.vm.showNewRow).toBe(false)
  })

  it('handles ChartHeader events correctly', async () => {
    wrapper = createWrapper()
    const chartHeader = wrapper.findComponent({ name: 'ChartHeader' })

    await chartHeader.vm.$emit('add-row')
    await chartHeader.vm.$emit('remove-rows')
    await chartHeader.vm.$emit('clear-all')
    await chartHeader.vm.$emit('toggle-new-row')

    // Component should handle events without errors
    expect(wrapper.exists()).toBe(true)
  })

  it('passes correct props to ChartContainer', () => {
    wrapper = createWrapper()
    const chartContainer = wrapper.findComponent({ name: 'ChartContainer' })

    expect(chartContainer.props('inputRows')).toEqual(wrapper.vm.inputRows)
    expect(chartContainer.props('title')).toBe(wrapper.vm.title)
    expect(chartContainer.props('height')).toBe(wrapper.vm.height)
    expect(chartContainer.props('width')).toBe(wrapper.vm.width)
    expect(chartContainer.props('showNewRow')).toBe(wrapper.vm.showNewRow)
  })

  it('renders without errors', () => {
    expect(() => {
      wrapper = createWrapper()
    }).not.toThrow()
  })
})
