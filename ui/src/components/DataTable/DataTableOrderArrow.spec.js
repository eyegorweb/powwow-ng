import DataTableOrderArrow from './DataTableOrderArrow';
import { shallowMount } from '@vue/test-utils';

describe('DataTableOrderArrow', () => {
  it('shows an up arrow when order is asc', () => {
    const columnName = 'id';

    const orderBy = {
      key: 'id',
      direction: 'ASC',
    };
    const wrapper = shallowMount(DataTableOrderArrow, {
      propsData: {
        columnName,
        orderBy,
      },
    });
    expect(wrapper.html()).toContain('ic-Arrow-Up-Icon');
  });

  it('shows a down arrow when order is desc', () => {
    const columnName = 'id';

    const orderBy = {
      key: 'id',
      direction: 'DESC',
    };
    const wrapper = shallowMount(DataTableOrderArrow, {
      propsData: {
        columnName,
        orderBy,
      },
    });
    expect(wrapper.html()).toContain('ic-Arrow-Down-Icon');
  });

  it('shows a double arrow when column is not concerned by the filter', () => {
    const columnName = 'id';

    const orderBy = {
      key: 'name',
      direction: 'DESC',
    };
    const wrapper = shallowMount(DataTableOrderArrow, {
      propsData: {
        columnName,
        orderBy,
      },
    });
    expect(wrapper.html()).toContain('ic-Arrow-Filter-Icon');
  });

  it('sends event to go front DESC to ASC', () => {
    const columnName = 'id';

    const orderBy = {
      key: 'id',
      direction: 'DESC',
    };
    const wrapper = shallowMount(DataTableOrderArrow, {
      propsData: {
        columnName,
        orderBy,
      },
    });
    wrapper.find('span').trigger('click');
    expect(wrapper.emitted('update:orderBy')).toEqual([[{ key: 'id', direction: 'ASC' }]]);
  });

  it('sends event to go front ASC to DESC', () => {
    const columnName = 'id';

    const orderBy = {
      key: 'id',
      direction: 'ASC',
    };
    const wrapper = shallowMount(DataTableOrderArrow, {
      propsData: {
        columnName,
        orderBy,
      },
    });
    wrapper.find('span').trigger('click');
    expect(wrapper.emitted('update:orderBy')).toEqual([[{ key: 'id', direction: 'DESC' }]]);
  });

  it('chooses a column on the first click', () => {
    const columnName = 'id';

    const orderBy = {
      key: 'otherColumn',
      direction: 'DESC',
    };
    const wrapper = shallowMount(DataTableOrderArrow, {
      propsData: {
        columnName,
        orderBy,
      },
    });
    wrapper.find('span').trigger('click');
    expect(wrapper.emitted('update:orderBy')).toEqual([[{ key: 'id', direction: 'ASC' }]]);
  });
});
