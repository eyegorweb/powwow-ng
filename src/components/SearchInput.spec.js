import { shallowMount } from '@vue/test-utils';
import SearchInput from './SearchInput.vue';

describe('SearchInput.vue', () => {
  /** @type {import('@vue/test-utils').Wrapper} */
  let wrapper;
  describe('single field', () => {
    beforeEach(() => {
      wrapper = shallowMount(SearchInput, {
        propsData: {
          value: '',
          items: [{ name: 'apple' }, { name: 'banana' }, { name: 'orange' }],
          fields: ['name'],
        },
        scopedSlots: {
          default: `<div slot-scope="{ results }">
            <div class="results">
              <span class="result" v-for="result in results">{{ result.item.name }} </span>
            </div>
            <div class="results-hl">
              <span class="result-hl" v-for="result in results">{{ result.highlighted }}</span>
            </div>
          </div>`,
        },
      });
    });

    it('gives all results with empty value', () => {
      expect(wrapper.find('.results').text()).toBe('apple banana orange');
    });

    it('filters results', () => {
      wrapper.setProps({ value: 'nana' });
      expect(wrapper.find('.results').text()).toBe('banana');
    });

    it('displays highlighted results when no value provided', () => {
      expect(wrapper.find('.results-hl').html()).toMatchSnapshot();
    });

    it('displays highlighted results', () => {
      wrapper.setProps({ value: 'nana' });
      expect(wrapper.find('.result-hl').html()).toMatchSnapshot();
    });
  });

  describe('multi field', () => {
    beforeEach(() => {
      wrapper = shallowMount(SearchInput, {
        propsData: {
          value: '',
          items: [
            { firstName: 'Jonathan', lastName: 'Joestar' },
            { firstName: 'Joseph', lastName: 'Joestar' },
            { firstName: 'Jotaro', lastName: 'Joestar' },
          ],
          fields: ['firstName', 'lastName'],
        },
        scopedSlots: {
          default: `<div slot-scope="{ results }">
            <div class="results">
              <span class="result" v-for="result in results">{{ result.item.firstName }} {{ result.item.lastName}} - </span>
            </div>
            <div class="results-hl">
              <span class="result-hl" v-for="result in results">{{ result.highlighted }}</span>
            </div>
          </div>`,
        },
      });
    });

    it('gives all results with empty value', () => {
      expect(wrapper.find('.results').html()).toMatchSnapshot();
    });

    it('filters results', () => {
      wrapper.setProps({ value: 'jonat' });
      expect(wrapper.find('.results').text()).toBe('Jonathan Joestar -');
    });

    it('displays highlighted results when no value provided', () => {
      expect(wrapper.find('.results-hl').html()).toMatchSnapshot();
    });

    it('displays highlighted results', () => {
      wrapper.setProps({ value: 'star' });
      expect(wrapper.find('.results-hl').html()).toMatchSnapshot();
    });
  });
});
