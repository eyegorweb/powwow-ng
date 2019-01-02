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
      },
      {
        label: 'Last name',
        name: 'lastName',
      },
    ];

    const extraColumns = [
      {
        label: 'First name',
        name: 'firstName',
        noHandle: true,
      },
      {
        label: 'Last name',
        name: 'lastName',
      },
      {
        label: 'Age',
        name: 'age',
      },
    ];

    wrapper = mount(ExtraColumns, {
      propsData: {
        columns,
        extraColumns,
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
      },
      {
        label: 'Last name',
        name: 'lastName',
      },
    ];

    const extraColumns = [
      {
        label: 'Age',
        name: 'age',
      },
    ];

    // NOTE: étrange que cela ne marche pas si on fait un `setProps`
    wrapper = mount(ExtraColumns, {
      propsData: {
        columns,
        extraColumns,
      },
      mocks,
    });
    expect(wrapper.vm.localExtraColumns[0].isChecked).toBeFalsy();
    wrapper.vm.localExtraColumns[0].isChecked = true;

    wrapper.find('button').trigger('click');
    const newSelectedColumns = wrapper.emitted()['update:columns'][0][0];
    expect(newSelectedColumns).toEqual([
      {
        label: 'First name',
        name: 'firstName',
      },
      {
        label: 'Last name',
        name: 'lastName',
      },
      {
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
      },
      {
        label: 'Last name',
        name: 'lastName',
      },
      {
        label: 'Age',
        name: 'age',
      },
    ];

    const extraColumns = [
      {
        label: 'Age',
        name: 'age',
      },
    ];

    // NOTE: étrange que cela ne marche pas si on fait un `setProps`
    wrapper = mount(ExtraColumns, {
      propsData: {
        columns,
        extraColumns,
      },
      mocks,
    });
    expect(wrapper.vm.localExtraColumns[0].isChecked).toBeTruthy();

    wrapper.find('button').trigger('click');
    const newSelectedColumns = wrapper.emitted()['update:columns'][0][0];
    expect(newSelectedColumns).toEqual([
      {
        label: 'First name',
        name: 'firstName',
      },
      {
        label: 'Last name',
        name: 'lastName',
      },
      {
        label: 'Age',
        name: 'age',
      },
    ]);
  });
});
