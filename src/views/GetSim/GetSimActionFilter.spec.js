import { mount } from '@vue/test-utils';
import GetSimAction from './GetSimActionFilter';

import { Store } from 'vuex-mock-store';

import { $t } from '@/../tests-utils';

const store = new Store({
  getters: {
    selectedAction: [
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

  it('mutates the store', () => {
    wrapper
      .findAll('input')
      .at(0)
      .trigger('click');
    expect(store.commit).toHaveBeenCalledTimes(1);
    expect(store.commit).toHaveBeenCalledWith('setActionFilter', [
      { id: 'action.active', label: 'Activé', value: false },
      { id: 'action.active', label: 'filters.actionValues.ACTIVATED', value: true },
    ]);
  });
});
