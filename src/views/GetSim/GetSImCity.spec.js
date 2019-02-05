import { mount } from '@vue/test-utils';
import GetSimCity from './GetSimCity';

import { Store } from 'vuex-mock-store';

import { $t } from '@/../tests-utils';

const store = new Store({
  getters: {
    selectedCityValue: '',
  },
});

const mocks = { $t, $store: store };

afterEach(() => store.reset());

describe('GetSimCity', () => {
  /** @type {import('@vue/test-utils').Wrapper} */
  let wrapper;
  wrapper = mount(GetSimCity, {
    mocks,
  });

  it('renders one input text field', () => {
    expect(wrapper.findAll('input[type="text"]')).toHaveLength(1);
  });

  it('mutates the store with the entered value', () => {
    wrapper.find('input').setValue('paris');
    expect(store.commit).toHaveBeenCalledTimes(1);
    expect(store.commit).toHaveBeenCalledWith('setCityFilter', 'paris');
  });
});
