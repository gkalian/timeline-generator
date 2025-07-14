import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import ChartContainer from '../../../src/components/chart/ChartContainer.vue'
import {
  getVuetifyStubs,
  createComponentWrapper,
  expectStandardComponentBehavior,
} from '../../setup/test-utils.js'

// Mock chart helper functions
vi.mock('../../../src/helper/chart.js', () => ({
  loadChart: vi.fn(),
  updateChartSeries: vi.fn(),
  defaultChartOptions: {
    chart: { type: 'timeline' },
    theme: { mode: 'light' }
  }
}))

describe('ChartContainer.vue', () => {
  let wrapper

  const mockInputRows = [
    { name: 'Project 1', comment: '', startTime: '01.2024', endTime: '06.2024' },
    { name: 'Project 2', comment: '', startTime: '07.2024', endTime: '12.2024' }
  ]

  const createWrapper = (props = {}) => {
    return createComponentWrapper(ChartContainer, mount, {
      props: {
        inputRows: mockInputRows,
        title: 'Test Timeline',
        height: '400',
        width: '900',
        showNewRow: false,
        ...props
      },
      global: {
        stubs: {
          ...getVuetifyStubs(),
          'v-col': {
            template: '<div class="v-col" v-bind="$attrs"><slot /></div>',
            inheritAttrs: false
          },
          ChartSettings: {
            name: 'ChartSettings',
            template: '<div data-testid="chart-settings">ChartSettings Mock</div>',
            props: ['initialPalette', 'initialShowLabels'],
            emits: ['update:palette', 'update:show-labels']
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

  it('renders chart container structure correctly', () => {
    wrapper = createWrapper()

    expectStandardComponentBehavior(wrapper)
    expect(wrapper.find('.generate-button').exists()).toBe(true)
    expect(wrapper.find('.chart-container').exists()).toBe(true)
    expect(wrapper.find('.chart-wrapper').exists()).toBe(true)
    expect(wrapper.find('#chart').exists()).toBe(true)
  })

  it('renders generate button with correct attributes', () => {
    wrapper = createWrapper()

    const generateButton = wrapper.findComponent({ name: 'v-btn' })
    expect(generateButton.exists()).toBe(true)
    expect(generateButton.text()).toBe('Generate timeline')
    expect(generateButton.attributes('title')).toBe('Generate chart')
  })

  it('shows ChartSettings when showNewRow is true', () => {
    wrapper = createWrapper({ showNewRow: true })

    expect(wrapper.findComponent({ name: 'ChartSettings' }).exists()).toBe(true)
  })

  it('has default values for palette and showLabels', () => {
    wrapper = createWrapper()

    expect(wrapper.vm.palette).toBe('palette1')
    expect(wrapper.vm.showLabels).toBe(false)
  })

  it('updatePalette method updates palette value', () => {
    wrapper = createWrapper()

    wrapper.vm.updatePalette('palette2')
    expect(wrapper.vm.palette).toBe('palette2')
  })

  it('updateShowLabels method updates showLabels value', () => {
    wrapper = createWrapper()

    wrapper.vm.updateShowLabels(true)
    expect(wrapper.vm.showLabels).toBe(true)
  })

  it('generateChart method exists and can be called', () => {
    wrapper = createWrapper()

    expect(wrapper.vm.generateChart).toBeTypeOf('function')

    // Should not throw when called
    expect(() => {
      wrapper.vm.generateChart()
    }).not.toThrow()
  })

  it('passes correct props to ChartSettings', () => {
    wrapper = createWrapper({ showNewRow: true })

    const chartSettings = wrapper.findComponent({ name: 'ChartSettings' })
    expect(chartSettings.props('initialPalette')).toBe('palette1')
    expect(chartSettings.props('initialShowLabels')).toBe(false)
  })

  it('handles ChartSettings events correctly', async () => {
    wrapper = createWrapper({ showNewRow: true })

    const chartSettings = wrapper.findComponent({ name: 'ChartSettings' })

    await chartSettings.vm.$emit('update:palette', 'palette3')
    expect(wrapper.vm.palette).toBe('palette3')

    await chartSettings.vm.$emit('update:show-labels', true)
    expect(wrapper.vm.showLabels).toBe(true)
  })

  it('renders chart element with correct id', () => {
    wrapper = createWrapper()

    const chartElement = wrapper.find('#chart')
    expect(chartElement.exists()).toBe(true)
    expect(chartElement.classes()).toContain('chart-element')
  })

  it('renders without errors', () => {
    expect(() => {
      wrapper = createWrapper()
    }).not.toThrow()
  })
})
