import { mount } from '@vue/test-utils';
import UiInput from './UiInput.vue';

describe('UiInput.vue', () => {
  /** @type {import('@vue/test-utils').Wrapper} */
  let wrapper;
  beforeEach(() => {
    wrapper = mount(UiInput, {
      propsData: { value: 'toto' },
    });
  });

  it('connects v-model', () => {
    const input = wrapper.find('input');
    expect(input.element.value).toBe('toto');
    input.setValue('tata');
    expect(wrapper.emitted('update:value')).toEqual([['tata']]);
  });
});
