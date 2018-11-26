import { mount } from '@vue/test-utils';
import SearchFilterByOption from './SearchFilterByOption.vue';

describe('components/SearchFilterByOption', () => {
  let wrapper;
  beforeEach(() => {
    const options = [
      {
        code: 'type1',
        value: 'type1',
        label: 'Type 1',
      },
      {
        code: 'type2',
        value: 'type2',
        label: 'Type 2',
      },
    ];
    const selectedOption = {};
    const inputValue = '';
    const result = {};

    /** @type {import('@vue/test-utils').Wrapper} */
    wrapper = mount(SearchFilterByOption, {
      propsData: {
        options,
        selectedOption,
        inputValue,
        result,
      },
    });
  });

  it('selects an option element and update v-model bound data ', () => {
    const options = wrapper.findAll('option');
    expect(options).toHaveLength(3);
    expect(options.at(1).text()).toEqual('Type 1');
  });

  it('gives result', () => {
    const options = wrapper.findAll('option');
    options.at(1).element.selected = true;
    wrapper.find('select').trigger('change');

    const input = wrapper.find('input[type="text"]');
    input.element.value = 'some value';
    input.trigger('input');

    expect(wrapper.emitted()['update:result'][0][0]).toEqual({
      options: {
        code: 'type1',
        value: 'type1',
        label: 'Type 1',
      },
      inputValue: undefined,
    });

    expect(wrapper.emitted()['update:result'][1][0]).toEqual({
      options: {
        code: 'type1',
        value: 'type1',
        label: 'Type 1',
      },
      inputValue: 'some value',
    });
  });
});
