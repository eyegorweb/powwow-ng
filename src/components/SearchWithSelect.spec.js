import { mount } from '@vue/test-utils';
import SearchWithSelect from './SearchWithSelect.vue';
import { $t } from '@/../tests-utils';

const mocks = { $t };

describe('components/SearchWithSelect', () => {
  let wrapper;
  beforeEach(() => {
    const options = [
      {
        value: 'type1',
        label: 'Type 1',
      },
      {
        value: 'type2',
        label: 'Type 2',
      },
    ];

    /** @type {import('@vue/test-utils').Wrapper} */
    wrapper = mount(SearchWithSelect, {
      mocks,
      propsData: {
        options,
        type: 'type2',
        query: 'toto',
      },
    });
  });

  it('binds type to select', () => {
    const options = wrapper.findAll('option');
    expect(options).toHaveLength(3);
    expect(wrapper.find('select').element.value).toEqual('type2');
  });

  it('binds query to input', () => {
    const input = wrapper.find('input');
    expect(input.element.value).toBe('toto');
    input.setValue('tata');
    expect(wrapper.emitted('update:query')).toEqual([['tata']]);
  });
});
