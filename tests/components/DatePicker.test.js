import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import DatePicker from '../../src/components/DatePicker.vue'
import {
  getVuetifyStubs,
  createComponentWrapper,
  expectStandardComponentBehavior,
} from '../setup/test-utils.js'

describe('DatePicker.vue', () => {
  let wrapper

  const createWrapper = (props = {}) => {
    return createComponentWrapper(DatePicker, mount, {
      props: {
        modelValue: '01.2024',
        label: 'Test Date',
        rules: [],
        ...props
      },
      global: {
        stubs: {
          ...getVuetifyStubs(),
          VueDatePicker: {
            name: 'VueDatePicker',
            template: '<div data-testid="vue-datepicker"><slot name="trigger"></slot></div>',
            props: ['monthPicker', 'position', 'teleport', 'modelValue'],
            emits: ['update:modelValue']
          }
        }
      }
    })
  }

  it('renders date picker structure correctly', () => {
    wrapper = createWrapper()

    expectStandardComponentBehavior(wrapper)
    expect(wrapper.find('[data-testid="vue-datepicker"]').exists()).toBe(true)
    expect(wrapper.findComponent({ name: 'v-text-field' }).exists()).toBe(true)
    expect(wrapper.findComponent({ name: 'v-btn' }).exists()).toBe(true)
  })

  it('displays text field with correct props', () => {
    wrapper = createWrapper({
      label: 'Custom Label',
      rules: [(v) => !!v || 'Required']
    })

    const textField = wrapper.findComponent({ name: 'v-text-field' })
    expect(textField.props('label')).toBe('Custom Label')
    expect(textField.props('readonly')).toBe(true)
    expect(textField.props('variant')).toBe('outlined')
    expect(textField.props('modelValue')).toBe('01.2024')
    expect(textField.props('rules')).toHaveLength(1)
  })

  it('renders VueDatePicker component', () => {
    wrapper = createWrapper()

    const vueDatePicker = wrapper.findComponent({ name: 'VueDatePicker' })
    expect(vueDatePicker.exists()).toBe(true)

    // Проверяем что компонент используется правильно (через HTML атрибуты)
    const html = wrapper.html()
    expect(html).toContain('data-testid="vue-datepicker"')
  })

  it('handles date picker value changes', async () => {
    wrapper = createWrapper()

    const vueDatePicker = wrapper.findComponent({ name: 'VueDatePicker' })
    await vueDatePicker.vm.$emit('update:modelValue', { year: 2024, month: 5 })

    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')[0]).toEqual(['06.2024'])
  })

  it('formats dates correctly', () => {
    wrapper = createWrapper()

    expect(wrapper.vm.toMMYYYY(new Date(2024, 0))).toBe('01.2024')
    expect(wrapper.vm.toMMYYYY(new Date(2024, 11))).toBe('12.2024')
  })

  it('renders without errors', () => {
    expect(() => {
      wrapper = createWrapper()
    }).not.toThrow()
  })
})
