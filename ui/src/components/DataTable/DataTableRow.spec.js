import { shallowMount } from '@vue/test-utils';
import { $t, $i18n } from '@/../tests-utils';
import DataTableRow from './DataTableRow.vue';

const mocks = { $i18n, $t };

describe('DataTableRow.vue', () => {
  /** @type {import('@vue/test-utils').Wrapper} */
  let wrapper;

  beforeEach(() => {
    const sortableColumns = [
      {
        label: 'First name',
        name: 'firstName',
        noHandle: true,
        visible: true,
      },
      {
        label: 'Last name',
        name: 'lastName',
        visible: true,
      },
    ];

    const row = [
      {
        id: 1,
        firstName: 'Leroy',
        lastName: 'Jenkins',
      },
    ];

    wrapper = shallowMount(DataTableRow, {
      directives: {
        tooltip: jest.fn(),
      },
      propsData: {
        sortableColumns,
        row,
        size: 7,
      },
      mocks,
    });
  });

  it('matches attributes to column names in rows', () => {
    expect(wrapper.findAll('tbody tr')).toHaveLength(1);
    expect(
      wrapper.contains('datatablecolumntypeswitcher-stub')
    ).toBe(true);
    expect(
      wrapper
        .findAll('tbody tr')
        .at(0)
        .findAll('td')
        .at(1)
        .contains('datatablecolumntypeswitcher-stub')
    ).toBe(true);
  });
});
