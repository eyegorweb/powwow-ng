import { mount } from '@vue/test-utils';
import GetSimLineStatus from './GetSimLineStatus';

import { Store } from 'vuex-mock-store';

import { $t } from '@/../tests-utils';

const store = new Store({
  getters: {
    selectedLineStatus: [
      {
        id: 'linestatus.active',
        label: 'Activé',
        value: false,
      },
    ],
  },
});

const mocks = { $t, $store: store };

afterEach(() => store.reset());

describe('GetSimLineStatus', () => {
  /** @type {import('@vue/test-utils').Wrapper} */
  let wrapper;
  wrapper = mount(GetSimLineStatus, {
    mocks,
  });

  it('renders 3 checkboxes for each line status', () => {
    expect(wrapper.findAll('input')).toHaveLength(3);
  });

  it('mutates the store', () => {
    wrapper
      .findAll('input')
      .at(0)
      .trigger('click');
    expect(store.commit).toHaveBeenCalledTimes(1);
    expect(store.commit).toHaveBeenCalledWith('setLineStatusFilter', [
      { id: 'linestatus.active', label: 'Activé', value: false },
      { id: 'linestatus.active', label: 'filters.lineStatusValues.ACTIVATED', value: true },
    ]);
  });
});
