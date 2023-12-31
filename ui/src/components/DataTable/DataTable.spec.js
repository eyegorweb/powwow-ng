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
        visible: true,
      },
      {
        label: 'Last name',
        name: 'lastName',
        visible: true,
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

    wrapper = shallowMount(DataTable, {
      directives: {
        tooltip: jest.fn(),
      },
      propsData: {
        columns,
        rows,
        orderBy,
        page,
        pageLimit,
        total,
        size: 7,
      },
      mocks,
    });
  });

  it('should not add a drag handle on non movable columns', () => {
    expect(wrapper.findAll('.handle')).toHaveLength(1);
  });

  it('matches attributes to rows', () => {
    expect(wrapper.contains('datatablerow-stub'));
  });
});
