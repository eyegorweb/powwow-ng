import { mount } from '@vue/test-utils';
import ChangeAlarmStatusContainer from './ChangeAlarmStatusContainer';

import { Store } from 'vuex-mock-store';
import { $t } from '@/../tests-utils';

describe(`ChangeAlarmStatusContainer`, () => {
  const storeParams = {
    getters: {},
    mutations: {
      flashMessage: jest.fn(),
      confirmAction: jest.fn(),
    },
  };
  const store = new Store(storeParams);

  afterEach(() => {
    store.reset();
  });

  it(`Afficher le bouton de confirmation si au moin une ligne est valide`, async () => {
    const apiConfig = {
      params: {},
      apiFn: jest.fn(),
    };
    apiConfig.apiFn.mockImplementationOnce(() => {
      return {
        validated: 1,
        errors: [
          {
            key: 'key1',
            number: 1,
            message: 'Message 1',
          },
        ],
      };
    });
    const wrapper = mount(ChangeAlarmStatusContainer, {
      mocks: { $t, $store: store },
      propsData: {
        apiConfig,
      },
    });
    await wrapper.vm.doAction();

    expect(wrapper.findAll('li')).toHaveLength(1);
    expect(wrapper.html()).toContain('Message 1');
    expect(wrapper.find('.btn-success').exists()).toBe(true);
  });

  it(`Ne pas afficher de bouton de validation si aucune ligne n'est validée`, async () => {
    const apiConfig = {
      params: {},
      apiFn: jest.fn(),
    };
    apiConfig.apiFn.mockImplementationOnce(() => {
      return {
        validated: 0,
        errors: [
          {
            key: 'key1',
            number: 1,
            message: 'Message 1',
          },
        ],
      };
    });
    const wrapper = mount(ChangeAlarmStatusContainer, {
      mocks: { $t, $store: store },
      propsData: {
        apiConfig,
      },
    });
    await wrapper.vm.doAction();

    expect(wrapper.findAll('li')).toHaveLength(1);
    expect(wrapper.html()).toContain('Message 1');
    expect(wrapper.find('.btn-success').exists()).toBe(false);
  });

  it(`Afficher message si la double validation est bien effectuée`, async () => {
    const apiConfig = {
      params: {},
      apiFn: jest.fn(),
    };
    apiConfig.apiFn.mockImplementationOnce(() => {
      return {
        tempDataUuid: 'ABCD',
      };
    });
    const wrapper = mount(ChangeAlarmStatusContainer, {
      mocks: { $t, $store: store },
      propsData: {
        apiConfig,
      },
      data() {
        return {
          tempDataUuid: 'TMP1',
        };
      },
    });

    storeParams.mutations.flashMessage = jest.fn();
    store.reset();

    await wrapper.vm.secondAttemptAction();
    expect(apiConfig.apiFn).toHaveBeenCalled();

    expect(store.commit.mock.calls[0]).toEqual([
      'flashMessage',
      { level: 'success', message: 'genericSuccessMessage' },
    ]);
  });
});
