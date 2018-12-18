import { shallowMount } from '@vue/test-utils';
import Checkbox from './Checkbox.vue';

describe('Checkbox.vue', () => {
  /** @type {import('@vue/test-utils').Wrapper} */
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(Checkbox, {
      propsData: { checked: true },
      slots: {
        default: '<b>Hello</b>',
      },
    });
  });

  it('displays checked state', () => {
    expect(wrapper.find('input').is(':checked')).toBe(true);
  });

  it('displays passed content', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('can be unchecked', () => {
    wrapper.find('input').setChecked(false);
    expect(wrapper.find('input').is(':checked')).toBe(false);
  });

  it('emits when checked changes', () => {
    wrapper.find('input').setChecked(false);
    // setChecked emet deux évemenements...
    expect(wrapper.emitted('change')).toEqual([[false], [false]]);
  });

  it('passes down value attribute', () => {
    wrapper = shallowMount(Checkbox, {
      attrs: { value: 'done' },
      propsData: { checked: true },
    });
    expect(wrapper.find('input').attributes()).toMatchObject({ value: 'done' });
  });

  describe('indeterminate state', () => {
    beforeEach(() => {
      wrapper = shallowMount(Checkbox, {
        propsData: { checked: [], value: ['foo', 'bar'] },
        slots: {
          default: '<b>Hello</b>',
        },
      });
    });

    it('is unchecked when value is an empty array', () => {
      expect(wrapper.find('input').is(':checked')).toBe(false);
    });

    it('is checked when value is the same array as checked', () => {
      wrapper.setProps({
        checked: ['foo', 'bar'],
      });
      expect(wrapper.find('input').is(':checked')).toBe(true);
    });

    it('empties the array when unchecked while checked', () => {
      wrapper.setProps({
        checked: ['foo', 'bar'],
      });
      // NOTE fails with vue test utils beta 26
      // expect(wrapper.find('input').is(':checked')).toBe(true);
      wrapper.find('input').setChecked(false);
      expect(wrapper.find('input').is(':checked')).toBe(false);
    });

    it('is indeterminate when value contains one element', () => {
      wrapper.setProps({
        checked: ['foo'],
      });
      expect(wrapper.find('input').is(':checked')).toBe(false);
      expect(wrapper.find('.checkmark').classes()).toContain('indeterminate');
    });
  });
});
