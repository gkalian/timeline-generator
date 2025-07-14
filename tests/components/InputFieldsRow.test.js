import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import InputFieldsRow from '../../src/components/InputFieldsRow.vue'
import {
  getVuetifyStubs,
  createComponentWrapper,
  expectStandardComponentBehavior,
} from '../setup/test-utils.js'

describe('InputFieldsRow.vue', () => {
  let wrapper

  const mockData = [
    {
      name: 'Test Project',
      comment: 'Test Comment',
      startTime: '01.2024',
      endTime: '12.2024'
    }
  ]

  const createWrapper = (props = {}) => {
    return createComponentWrapper(InputFieldsRow, mount, {
      props: {
        modelValue: [...mockData],
        ...props
      },
      global: {
        stubs: {
          ...getVuetifyStubs(),
          'v-col': {
            template: '<div class="v-col"><slot /></div>'
          },
          DatePicker: {
            name: 'DatePicker',
            template: '<div data-testid="date-picker">DatePicker</div>',
            props: ['modelValue', 'label', 'rules', 'dense']
          }
        }
      }
    })
  }

  beforeEach(() => {
    if (wrapper) {
      wrapper.unmount()
    }
  })

  it('renders component correctly', () => {
    wrapper = createWrapper()

    expectStandardComponentBehavior(wrapper)
    expect(wrapper.find('.main-input-fields').exists()).toBe(true)
    expect(wrapper.findAllComponents({ name: 'v-text-field' })).toHaveLength(2)
    expect(wrapper.findAllComponents({ name: 'DatePicker' })).toHaveLength(2)
  })

  it('displays correct values', () => {
    wrapper = createWrapper()

    const textFields = wrapper.findAllComponents({ name: 'v-text-field' })
    expect(textFields[0].props('modelValue')).toBe('Test Project')
    expect(textFields[1].props('modelValue')).toBe('Test Comment')

    const datePickers = wrapper.findAllComponents({ name: 'DatePicker' })
    expect(datePickers[0].props('modelValue')).toBe('01.2024')
    expect(datePickers[1].props('modelValue')).toBe('12.2024')
  })

  it('has validation rules', () => {
    wrapper = createWrapper()

    // Test nameRequiredRule
    expect(wrapper.vm.rules.nameRequiredRule('Test')).toBe(true)
    expect(wrapper.vm.rules.nameRequiredRule('')).toBe('Name is required')

    // Test dateFormatRule
    expect(wrapper.vm.rules.dateFormatRule('01.2024')).toBe(true)
    expect(wrapper.vm.rules.dateFormatRule('invalid')).toBe('Correct format is MM.YYYY')

    // Test chartRequiredRule
    expect(wrapper.vm.rules.chartRequiredRule('value')).toBe(true)
    expect(wrapper.vm.rules.chartRequiredRule('')).toBe('Value is required')
  })

  it('has updateRow method that emits events', () => {
    wrapper = createWrapper()

    wrapper.vm.updateRow(0, 'name', 'New Name')

    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
  })

  it('handles multiple rows', () => {
    const multipleRows = [
      { name: 'Project 1', comment: '', startTime: '01.2024', endTime: '06.2024' },
      { name: 'Project 2', comment: '', startTime: '07.2024', endTime: '12.2024' }
    ]

    wrapper = createWrapper({ modelValue: multipleRows })

    expect(wrapper.findAll('.v-row')).toHaveLength(2)
    expect(wrapper.findAllComponents({ name: 'v-text-field' })).toHaveLength(4)
  })

  it('renders without errors', () => {
    expect(() => {
      wrapper = createWrapper()
    }).not.toThrow()
  })
})
