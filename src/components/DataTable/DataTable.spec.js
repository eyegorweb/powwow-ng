import { shallowMount } from '@vue/test-utils';
import { $t, $i18n } from '@/../tests-utils';
import DataTable from './DataTable.vue';

const mocks = { $i18n, $t };

describe('DataTable.vue', () => {
  /** @type {import('@vue/test-utils').Wrapper} */
  let wrapper;

  beforeEach(() => {
    const columns = [
      {
        label: 'First name',
        name: 'firstName',
        noHandle: true,
      },
      {
        label: 'Last name',
        name: 'lastName',
      },
    ];

    const rows = [
      {
        id: 1,
        firstName: 'Leroy',
        lastName: 'Jenkins',
      },
    ];
    const orderBy = {};
    const page = 1;
    const pageLimit = 10;
    const total = 20;

    const extraColumns = [];

    wrapper = shallowMount(DataTable, {
      propsData: {
        columns,
        rows,
        extraColumns,
        orderBy,
        page,
        pageLimit,
        total,
      },
      mocks,
    });
  });

  it('should not add a drag handle on non movable columns', () => {
    expect(wrapper.findAll('.handle')).toHaveLength(1);
  });

  it('matches attributes to column names in rows', () => {
    console.log('dataTableTest', wrapper.html());
    expect(wrapper.findAll('tbody tr')).toHaveLength(1);
    expect(
      wrapper
        .findAll('tbody tr')
        .at(0)
        .find('td')
        .contains('datatablecolumntypeswitcher-stub')
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
