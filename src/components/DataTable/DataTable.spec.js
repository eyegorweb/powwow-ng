import { shallowMount } from '@vue/test-utils';
import DataTable from '@/components/DataTable/index.vue';

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

    const extraColumns = [];

    wrapper = shallowMount(DataTable, {
      propsData: {
        columns,
        rows,
        extraColumns,
      },
    });
  });

  it('should not add a drag handle on non movable columns', () => {
    expect(wrapper.findAll('.handle')).toHaveLength(1);
  });

  it('matches attributes to column names in rows', () => {
    expect(wrapper.findAll('tbody tr')).toHaveLength(1);
    expect(
      wrapper
        .findAll('tbody tr')
        .at(0)
        .find('td')
        .text()
    ).toBe('Leroy');
    expect(
      wrapper
        .findAll('tbody tr')
        .at(0)
        .findAll('td')
        .at(1)
        .text()
    ).toBe('Jenkins');
  });
});
