import { shallowMount } from '@vue/test-utils';
import CustomFields from './CustomFields';
import { $t, $i18n } from '@/../tests-utils';

const mocks = { $i18n, $t };

jest.mock('daterangepicker/daterangepicker.js', () => {});
jest.mock('daterangepicker/daterangepicker.css', () => {});

describe('FoldableBlock', () => {
  it('display custom field depending on type', async () => {
    const customFields = [
      { id: '101customField1', code: 'customField1', type: 'TEXT', value: [], label: 'Field 1' },
      { id: '101customField2', code: 'customField2', type: 'TEXT', value: [], label: 'Field 2' },
      { id: '101customField3', code: 'customField3', type: 'TEXT', value: [], label: 'Field 3' },
      { id: '101customField4', code: 'customField4', type: 'TEXT', value: [], label: 'Field 4' },
      { id: '101customField5', code: 'customField5', type: 'DATE', value: [], label: 'Field 5' },
      {
        id: '101customField6',
        code: 'customField6',
        type: 'LIST',
        value: ['pomme de reinette', 'pomme d api'],
      },
    ];
    const wrapper = shallowMount(CustomFields, {
      propsData: {
        customFields,
        getSelectedValue: () => {},
      },
      mocks,
    });

    const inputs = wrapper.findAllComponents({ name: 'UiInput' });
    const dateComponents = wrapper.findAllComponents({ name: 'UiDate' });
    expect(inputs).toHaveLength(4);
    expect(dateComponents).toHaveLength(1);
  });
});
