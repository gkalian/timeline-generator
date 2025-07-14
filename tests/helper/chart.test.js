import { describe, it, expect, vi, beforeEach } from 'vitest'
import { chart, defaultChartOptions, loadChart, updateChartSeries } from '../../src/helper/chart.js'

const mockChart = {
  render: vi.fn(),
  updateOptions: vi.fn(),
  updateSeries: vi.fn()
}

vi.mock('apexcharts', () => ({
  default: vi.fn(() => mockChart)
}))

vi.mock('vue', () => ({
  ref: vi.fn(() => ({ value: null })),
  onMounted: vi.fn((callback) => callback())
}))

describe('chart.js', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    chart.value = null
    document.querySelector = vi.fn(() => ({}))
  })

  it('exports chart configuration and functions', () => {
    expect(chart).toBeDefined()
    expect(defaultChartOptions).toBeDefined()
    expect(loadChart).toBeTypeOf('function')
    expect(updateChartSeries).toBeTypeOf('function')

    expect(defaultChartOptions.chart.type).toBe('rangeBar')
    expect(defaultChartOptions.title.text).toBe('Timeline')
  })

  it('updateChartSeries handles data when chart exists', () => {

    chart.value = mockChart

    const mockInputRows = [
      { name: 'Test', comment: 'Comment', startTime: '01.2024', endTime: '12.2024' }
    ]

    expect(() => {
      updateChartSeries(mockInputRows, 'Test Title', '400', '900', 'palette1', false)
    }).not.toThrow()
  })
})
