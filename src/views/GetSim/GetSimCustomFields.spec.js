import { mount } from '@vue/test-utils';
import { Store } from 'vuex-mock-store';
import GetSimCustomFields from './GetSimCustomFields';

import { $t } from '@/../tests-utils';

jest.mock('flatpickr/dist/flatpickr.min.css', () => {});

const setCustomFieldsFilterMock = jest.fn();
const store = new Store({
  getters: {
    filterCustomFieldsList: [
      { id: '101customField1', code: 'customField1', type: 'TEXT', value: [] },
      { id: '101customField2', code: 'customField2', type: 'TEXT', value: [] },
      { id: '101customField3', code: 'customField3', type: 'TEXT', value: [] },
      { id: '101customField4', code: 'customField4', type: 'TEXT', value: [] },
      { id: '101customField5', code: 'customField5', type: 'DATE', value: [] },
      {
        id: '101customField6',
        code: 'customField6',
        type: 'LIST',
        value: ['pomme de reinette', 'pomme d api'],
      },
    ],

    selectedCustomFieldsValues: [
      { id: 'customField3', value: 'some value', label: 'Champ libre 3: some value' },
    ],
  },
  mutations: {
    setCustomFieldsFilter: setCustomFieldsFilterMock,
  },
});

describe('GetSimCustomFields', () => {
  it('display custom field depending on type', async () => {
    const wrapper = mount(GetSimCustomFields, {
      mocks: {
        $store: store,
        $t,
      },
    });
    await wrapper.vm.$nextTick();
    expect(wrapper.find('input').exists()).toBe(true);
    const allOptions = wrapper.findAll('option');
    expect(allOptions).toHaveLength(3);
    expect(allOptions.at(1).text()).toBe('pomme de reinette');
    expect(allOptions.at(2).text()).toBe('pomme d api');
    expect(wrapper.find('.flatpickr-input').exists()).toBe(true);
  });

  it('store custom field values in store for synthesis', () => {
    const wrapper = mount(GetSimCustomFields, {
      mocks: {
        $store: store,
        $t,
      },
    });
    wrapper.vm.setCustomFieldsFilter = jest.fn();
    wrapper.vm.onValueChanged(
      { id: '101customField1', code: 'customField1', type: 'TEXT', value: [] },
      'new value'
    );

    expect(wrapper.vm.setCustomFieldsFilter).toHaveBeenCalledWith([
      { id: 'customField3', label: 'Champ libre 3: some value', value: 'some value' },
      { id: 'customField1', label: 'customFields.customField1: new value', value: 'new value' },
    ]);
  });

  it('updates value of already selected filter', () => {
    const wrapper = mount(GetSimCustomFields, {
      mocks: {
        $store: store,
        $t,
      },
    });
    wrapper.vm.setCustomFieldsFilter = jest.fn();
    wrapper.vm.onValueChanged(
      { id: '101customField3', code: 'customField3', type: 'TEXT', value: [] },
      'new value'
    );

    expect(wrapper.vm.setCustomFieldsFilter).toHaveBeenCalledWith([
      { id: 'customField3', label: 'customFields.customField3: new value', value: 'new value' },
    ]);
  });
});
