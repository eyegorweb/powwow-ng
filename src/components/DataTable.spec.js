import { shallowMount } from '@vue/test-utils';
import DataTable from '@/components/DataTable.vue';
import tableDragger from 'table-dragger';

jest.mock('table-dragger', () => {
  return jest.fn(() => {
    return {
      destroy: jest.fn(),
    };
  });
});

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

    wrapper = shallowMount(DataTable, {
      propsData: {
        columns,
        rows,
      },
    });
  });

  it('Should call table dragger on table element', () => {
    expect(tableDragger).toHaveBeenCalledWith(wrapper.element, { dragHandler: '.handle' });
  });

  it('Should not add a drag handle on non movable columns', () => {
    expect(wrapper.findAll('.handle')).toHaveLength(1);
  });

  it('Should match attributes to column names in rows', () => {
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

  it('Should reset the plugin when columns change', async () => {
    const columns = [
      {
        label: 'First name',
        name: 'firstName',
      },
      {
        label: 'Last name',
        name: 'lastName',
      },
    ];

    wrapper.setProps({
      columns,
      rows: [],
    });

    const beforeDestroyDragCtrl = wrapper.vm.dragCtrl;
    expect(wrapper.vm.dragCtrl.destroy).toHaveBeenCalled();

    // Ensure that a new tableDragger instance was created
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.dragCtrl).not.toBe(beforeDestroyDragCtrl);
  });

  it('Should destroy table plugin when component is destroyed', async () => {
    const beforeDestroyDragCtrl = wrapper.vm.dragCtrl;
    wrapper.destroy();
    expect(beforeDestroyDragCtrl.destroy).toHaveBeenCalled();
  });
});
