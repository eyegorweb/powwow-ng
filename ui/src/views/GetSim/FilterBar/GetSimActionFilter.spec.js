import { mount } from '@vue/test-utils';
import GetSimAction from './GetSimActionFilter';

import { Store } from 'vuex-mock-store';

import { $t } from '@/../tests-utils';

const store = new Store({
  state: { getsim: {} },
  getters: {
    'getsim/selectedAction': [
      {
        id: 'action.active',
        label: 'Activé',
        value: false,
      },
    ],
  },
});

const mocks = { $t, $store: store };

afterEach(() => store.reset());

describe('GetSimAction', () => {
  /** @type {import('@vue/test-utils').Wrapper} */
  let wrapper;
  wrapper = mount(GetSimAction, {
    mocks,
  });

  it('renders 3 checkboxes for each line status', () => {
    expect(wrapper.findAll('input')).toHaveLength(2);
  });

  it('mutates the store', async () => {
    await wrapper
      .findAll('input')
      .at(0)
      .trigger('click');
    expect(store.commit).toHaveBeenCalledTimes(1);
    expect(store.commit).toHaveBeenCalledWith('getsim/setActionFilter', [
      { id: 'action.active', label: 'Activé', value: false },
      { id: 'action.PreActive', label: 'filters.actionValues.PREACTIVATED', value: true },
    ]);
  });
});
