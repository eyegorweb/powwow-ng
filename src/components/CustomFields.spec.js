import { shallowMount } from '@vue/test-utils';
import CustomFields from './CustomFields';
import { $t, $i18n } from '@/../tests-utils';

const mocks = { $i18n, $t };

jest.mock('daterangepicker/daterangepicker.js', () => {});
jest.mock('daterangepicker/daterangepicker.css', () => {});

describe('FoldableBlock', () => {
  it('display custom field depending on type', async () => {
    const fields = [
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
    ];
    const wrapper = shallowMount(CustomFields, {
      propsData: {
        fields,
        getSelectedValue: () => {},
      },
      mocks,
    });
    expect(wrapper.html()).toContain('<uiinput-stub inputtype="text" class="d-block">');
    expect(wrapper.html()).toContain('<uiinput-stub inputtype="text" class="d-block">');
    expect(wrapper.html()).toContain(
      '<uiselect-stub placeholder="Choisissez une valeur" options="pomme de reinette,pomme d api" class="select-filter">'
    );
  });
});
