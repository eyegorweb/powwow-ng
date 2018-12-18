import { shallowMount } from '@vue/test-utils';
import DataTablePagination from './DataTablePagination.vue';

describe('DataTablePagination', () => {
  it('Should show number of pages', () => {
    const wrapper = shallowMount(DataTablePagination, {
      propsData: {
        page: 1,
        total: 22,
        pageLimit: 10,
      },
    });
    expect(wrapper.findAll('.page-nb')).toHaveLength(3);
  });
  it('shows a windows of 3 page numbers in the middle', () => {
    const wrapper = shallowMount(DataTablePagination, {
      propsData: {
        page: 4,
        total: 60,
        pageLimit: 10,
      },
    });

    expect(
      wrapper
        .findAll('.page-nb')
        .at(0)
        .text()
    ).toEqual('3');
    expect(
      wrapper
        .findAll('.page-nb')
        .at(1)
        .text()
    ).toEqual('4');
    expect(
      wrapper
        .findAll('.page-nb')
        .at(2)
        .text()
    ).toEqual('5');

    expect(wrapper.findAll('.page-nb')).toHaveLength(3);
  });

  it('shows a windows of 3 page numbers from the first page', () => {
    const wrapper = shallowMount(DataTablePagination, {
      propsData: {
        page: 1,
        total: 60,
        pageLimit: 10,
      },
    });

    expect(
      wrapper
        .findAll('.page-nb')
        .at(0)
        .text()
    ).toEqual('1');
    expect(
      wrapper
        .findAll('.page-nb')
        .at(1)
        .text()
    ).toEqual('2');
    expect(
      wrapper
        .findAll('.page-nb')
        .at(2)
        .text()
    ).toEqual('3');

    expect(wrapper.findAll('.page-nb')).toHaveLength(3);
  });
  it('shows a windows of 3 page numbers for the last 3 pages', () => {
    const wrapper = shallowMount(DataTablePagination, {
      propsData: {
        page: 6,
        total: 60,
        pageLimit: 10,
      },
    });

    expect(
      wrapper
        .findAll('.page-nb')
        .at(0)
        .text()
    ).toEqual('4');
    expect(
      wrapper
        .findAll('.page-nb')
        .at(1)
        .text()
    ).toEqual('5');
    expect(
      wrapper
        .findAll('.page-nb')
        .at(2)
        .text()
    ).toEqual('6');

    expect(wrapper.findAll('.page-nb')).toHaveLength(3);
  });
});
