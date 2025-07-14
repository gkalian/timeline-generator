import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  saveInputRows,
  saveChartSettings,
  loadInputRows,
  loadChartSettings,
  clearInputRows,
  clearChartSettings,
  clearAllData,
  handleFileSelect,
  handleFileLoad
} from '../../src/helper/utils.js'

const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn()
}

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

describe('utils.js', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('exports utility functions and handles basic operations', () => {
    expect(saveInputRows).toBeTypeOf('function')
    expect(saveChartSettings).toBeTypeOf('function')
    expect(loadInputRows).toBeTypeOf('function')
    expect(loadChartSettings).toBeTypeOf('function')
    expect(clearInputRows).toBeTypeOf('function')
    expect(clearChartSettings).toBeTypeOf('function')
    expect(clearAllData).toBeTypeOf('function')
    expect(handleFileSelect).toBeTypeOf('function')
    expect(handleFileLoad).toBeTypeOf('function')

    // Test basic save operation
    const mockData = [{ name: 'Test', comment: '', startTime: '01.2024', endTime: '12.2024' }]
    saveInputRows(mockData, 'Test Title', '400', '900')

    expect(localStorageMock.setItem).toHaveBeenCalledWith('inputRows', JSON.stringify(mockData))
    expect(localStorageMock.setItem).toHaveBeenCalledWith('chartTitle', 'Test Title')
  })

  it('handles file operations and data processing', () => {

    const mockEvent = {
      target: {
        result: 'Test Title,400,900\nProject 1,Comment,01.2024,12.2024\nProject 2,,02.2024,11.2024'
      }
    }

    const result = handleFileLoad(mockEvent)

    expect(result).toBeDefined()
    expect(result.chartTitle).toBe('Test Title')
    expect(result.chartHeight).toBe('400')
    expect(result.chartWidth).toBe('900')
    expect(result.rows).toHaveLength(2)
    expect(result.rows[0].name).toBe('Project 1')
    expect(result.rows[0].startTime).toBe('01.2024')

    clearAllData()
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('inputRows')
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('chartTitle')
  })
})
