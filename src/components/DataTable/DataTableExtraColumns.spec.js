import { mount } from '@vue/test-utils';
import { $t, $i18n } from '@/../tests-utils';
import ExtraColumns from './DataTableExtraColumns.vue';

const mocks = { $i18n, $t };

describe('DataTableExtraColumns.vue', () => {
  /** @type {import('@vue/test-utils').Wrapper} */
  let wrapper;

  beforeEach(() => {
    const columns = [
      {
        label: 'First name',
        name: 'firstName',
        id: 1,
      },
      {
        label: 'Last name',
        name: 'lastName',
        id: 2,
      },
    ];

    const extraColumns = [
      {
        label: 'First name',
        name: 'firstName',
        noHandle: true,
        id: 1,
      },
      {
        label: 'Last name',
        name: 'lastName',
        id: 2,
      },
      {
        label: 'Age',
        name: 'age',
        id: 3,
      },
    ];

    wrapper = mount(ExtraColumns, {
      propsData: {
        columns,
        extraColumns,
        maxAllowedExtraColumns: 1,
      },
      mocks,
    });
  });

  it('checks colums that are already added when component is created', () => {
    expect(wrapper.vm.localExtraColumns[0].isChecked).toBeTruthy();
    expect(wrapper.vm.localExtraColumns[1].isChecked).toBeTruthy();
    expect(wrapper.vm.localExtraColumns[2].isChecked).toBeFalsy();
  });

  it('it adds an extra column', () => {
    const columns = [
      {
        label: 'First name',
        name: 'firstName',
        id: 1,
      },
      {
        label: 'Last name',
        name: 'lastName',
        id: 2,
      },
    ];

    const extraColumns = [
      {
        label: 'Age',
        name: 'age',
        id: 3,
      },
    ];

    // NOTE: étrange que cela ne marche pas si on fait un `setProps`
    wrapper = mount(ExtraColumns, {
      propsData: {
        columns,
        extraColumns,
        maxAllowedExtraColumns: 1,
      },
      mocks,
    });
    expect(wrapper.vm.localExtraColumns[0].isChecked).toBeFalsy();
    wrapper.vm.localExtraColumns[0].isChecked = true;

    wrapper.find('button').trigger('click');
    const newSelectedColumns = wrapper.emitted()['update:columns'][0][0];
    expect(newSelectedColumns).toEqual([
      {
        id: 1,
        label: 'First name',
        name: 'firstName',
      },
      {
        id: 2,
        label: 'Last name',
        name: 'lastName',
      },
      {
        format: undefined,
        id: 3,
        label: 'Age',
        name: 'age',
      },
    ]);
  });

  it('should not add already present columns', () => {
    const columns = [
      {
        label: 'First name',
        name: 'firstName',
        id: 1,
      },
      {
        label: 'Last name',
        name: 'lastName',
        id: 2,
      },
      {
        label: 'Age',
        name: 'age',
        id: 3,
      },
    ];

    const extraColumns = [
      {
        label: 'Age',
        name: 'age',
        id: 3,
      },
    ];

    // NOTE: étrange que cela ne marche pas si on fait un `setProps`
    wrapper = mount(ExtraColumns, {
      propsData: {
        columns,
        extraColumns,
        maxAllowedExtraColumns: 1,
      },
      mocks,
    });
    expect(wrapper.vm.localExtraColumns[0].isChecked).toBeTruthy();

    wrapper.find('button').trigger('click');
    const newSelectedColumns = wrapper.emitted()['update:columns'][0][0];
    expect(newSelectedColumns).toEqual([
      {
        id: 1,
        label: 'First name',
        name: 'firstName',
      },
      {
        id: 2,
        label: 'Last name',
        name: 'lastName',
      },
      {
        format: undefined,
        id: 3,
        label: 'Age',
        name: 'age',
      },
    ]);
  });
});
