import { mount } from '@vue/test-utils';
import GetSimPostalCode from './GetSimPostalCode';

import { Store } from 'vuex-mock-store';

import { $t } from '@/../tests-utils';

const store = new Store({
  state: { getsim: {} },
  getters: {
    selectedPostalCodeValue: '',
  },
});

const mocks = { $t, $store: store };

afterEach(() => store.reset());

describe('GetSimPostalCode', () => {
  /** @type {import('@vue/test-utils').Wrapper} */
  let wrapper;
  wrapper = mount(GetSimPostalCode, {
    mocks,
  });

  it.skip('renders one input number field', () => {
    expect(wrapper.findAll('input[type="number"]')).toHaveLength(1);
  });

  it('mutates the store with the entered value', () => {
    wrapper.find('input').setValue(75010);
    expect(store.commit).toHaveBeenCalledTimes(1);
    expect(store.commit).toHaveBeenCalledWith('getsim/setPostalCodeFilter', '75010');
  });
});
