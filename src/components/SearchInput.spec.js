import { shallowMount } from '@vue/test-utils';
import SearchInput from './SearchInput.vue';

describe('SearchInput.vue', () => {
  /** @type {import('@vue/test-utils').Wrapper} */
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(SearchInput, {
      propsData: {
        value: '',
        items: [{ name: 'banana' }, { name: 'apple' }, { name: 'orange' }],
        fields: ['name'],
      },
      scopedSlots: {
        default: `<div class="results" slot-scope="{ results }">
          <span class="result" v-for="result in results">{{ result.name }} </span>
        </div>`,
      },
    });
  });

  it('gives all results with empty value', () => {
    expect(wrapper.find('.results').text()).toBe('banana apple orange');
  });

  it('filters results', () => {
    wrapper.setProps({ value: 'nana' });
    expect(wrapper.find('.results').text()).toBe('banana');
  });
});
