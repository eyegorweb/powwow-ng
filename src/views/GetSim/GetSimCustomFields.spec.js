import { mount } from '@vue/test-utils';
import { Store } from 'vuex-mock-store';
import GetSimCustomFields from './GetSimCustomFields';

jest.mock('flatpickr/dist/flatpickr.min.css', () => {});

describe('GetSimCustomFields', () => {
  it('display custom field depending on type', async () => {
    const store = new Store({
      getters: {
        filterCustomFields: [
          {
            id: 'f1',
            type: 'input',
            label: 'nom',
          },
          {
            id: 'f2',
            type: 'listchoices',
            label: 'faction',
            value: ['lesZinsZins', 'pioupiouEtCie'],
          },
          {
            id: 'f3',
            type: 'date',
            label: 'birthday',
          },
        ],
      },
    });

    const wrapper = mount(GetSimCustomFields, {
      mocks: {
        $store: store,
      },
    });
    await wrapper.vm.$nextTick();
    expect(wrapper.find('input').exists()).toBe(true);
    const allOptions = wrapper.findAll('option');
    expect(allOptions).toHaveLength(3);
    expect(allOptions.at(1).text()).toBe('lesZinsZins');
    expect(allOptions.at(2).text()).toBe('pioupiouEtCie');
    expect(wrapper.find('.flatpickr-input').exists()).toBe(true);
  });
});
