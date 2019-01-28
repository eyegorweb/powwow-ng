import { mount } from '@vue/test-utils';
import UiDateRange from './UiDateRange.vue';
import { subMonths } from 'date-fns';

// need to manually mock the css imported from node_modules
jest.mock('flatpickr/dist/flatpickr.min.css', () => {});

// dates to use in tests
const dates = {
  september: new Date(2018, 9, 2),
  october: new Date(2018, 10, 2),
  december: new Date(2018, 12, 2),
  nextYearJanuary: new Date(2019, 1, 2),
  today: new Date(2018, 11, 11),
};

describe('UiDateRange', () => {
  /** @type {import('@vue/test-utils').Wrapper} */
  let wrapper;

  beforeEach(() => {
    const date = new Date(2018, 11, 10);
    wrapper = mount(UiDateRange, {
      propsData: { date, start: null, end: null },
    });
  });

  describe('null as initial value', () => {
    it('sets start and end at the same time', () => {
      wrapper.vm.onChange([dates.october, dates.december]);
      expect(wrapper.emitted('update:start')).toEqual([[dates.october]]);
      expect(wrapper.emitted('update:end')).toEqual([[dates.december]]);
      expect(wrapper.emitted('update:range')).toEqual([
        [{ start: dates.october, end: dates.december }],
      ]);
    });

    it('sets only the start', () => {
      wrapper.vm.onChange([dates.october, null]);
      expect(wrapper.emitted('update:start')).toEqual([[dates.october]]);
      expect(wrapper.emitted('update:end')).toBeUndefined();
      expect(wrapper.emitted('update:range')).toBeUndefined();
    });

    it('sets only the end', () => {
      wrapper.vm.onChange([null, dates.december]);
      expect(wrapper.emitted('update:start')).toBeUndefined();
      expect(wrapper.emitted('update:end')).toEqual([[dates.december]]);
      expect(wrapper.emitted('update:range')).toBeUndefined();
    });
  });

  describe('date as initial value', () => {
    beforeEach(() => {
      wrapper.setProps({
        start: dates.september,
        end: dates.nextYearJanuary,
      });
    });

    it('sets start and end at the same time with different dates', () => {
      wrapper.vm.onChange([dates.october, dates.december]);
      expect(wrapper.emitted('update:start')).toEqual([[dates.october]]);
      expect(wrapper.emitted('update:end')).toEqual([[dates.december]]);
      expect(wrapper.emitted('update:range')).toEqual([
        [{ start: dates.october, end: dates.december }],
      ]);
    });

    it('sets only the end with a different date', () => {
      wrapper.vm.onChange([null, dates.december]);
      expect(wrapper.emitted('update:start')).toBeUndefined();
      expect(wrapper.emitted('update:end')).toEqual([[dates.december]]);
      expect(wrapper.emitted('update:range')).toBeUndefined();
    });

    it('sets only the start with a different date', () => {
      wrapper.vm.onChange([dates.october, null]);
      expect(wrapper.emitted('update:start')).toEqual([[dates.october]]);
      expect(wrapper.emitted('update:end')).toBeUndefined();
      expect(wrapper.emitted('update:range')).toBeUndefined();
    });

    it('does not emmits when start has the same value', () => {
      wrapper.vm.onChange([new Date(dates.september), dates.december]);
      expect(wrapper.emitted('update:start')).toBeUndefined();
      expect(wrapper.emitted('update:end')).toEqual([[dates.december]]);
      expect(wrapper.emitted('update:range')).toEqual([
        [{ start: dates.september, end: dates.december }],
      ]);
    });

    it('does not emmits when end has the same value', () => {
      wrapper.vm.onChange([dates.october, new Date(dates.nextYearJanuary)]);
      expect(wrapper.emitted('update:end')).toBeUndefined();
      expect(wrapper.emitted('update:start')).toEqual([[dates.october]]);
      expect(wrapper.emitted('update:range')).toEqual([
        [{ start: dates.october, end: dates.nextYearJanuary }],
      ]);
    });
  });

  describe('updates dates on click', () => {
    const RealDate = Date;

    it('binds end to input', () => {
      wrapper.find('.dropdown-toggle').trigger('click');
      expect(
        wrapper
          .findAll('.btn-outline-primary')
          .at(0)
          .text()
      ).toEqual('Commandes depuis 1 mois');

      // NOTE on fait ca localement car sinon flatpickr log plein de warnings
      global.Date = jest.fn(() => dates.today);
      global.Date.setDate = RealDate.setDate;

      wrapper
        .findAll('.btn-outline-primary')
        .at(0)
        .trigger('click');

      global.Date = RealDate;

      expect(wrapper.emitted('update:end')).toEqual([[dates.today]]);
    });

    it('substracts start to 1 month and binds input', () => {
      wrapper.find('.dropdown-toggle').trigger('click');
      expect(
        wrapper
          .findAll('.btn-outline-primary')
          .at(0)
          .text()
      ).toEqual('Commandes depuis 1 mois');

      global.Date = jest.fn(() => dates.today);
      global.Date.setDate = RealDate.setDate;

      const startMonth = subMonths(dates.today, 1);

      wrapper
        .findAll('.btn-outline-primary')
        .at(0)
        .trigger('click');

      global.Date = RealDate;

      expect(wrapper.emitted('update:start')).toEqual([[startMonth]]);
      expect(wrapper.emitted('update:range')).toEqual([[{ start: startMonth, end: dates.today }]]);
    });

    it('substracts start to 3 month and binds input', () => {
      wrapper.find('.dropdown-toggle').trigger('click');
      expect(
        wrapper
          .findAll('.btn-outline-primary')
          .at(1)
          .text()
      ).toEqual('Commandes depuis 3 mois');

      global.Date = jest.fn(() => dates.today);
      global.Date.setDate = RealDate.setDate;

      const startMonth = subMonths(dates.today, 3);

      wrapper
        .findAll('.btn-outline-primary')
        .at(1)
        .trigger('click');

      global.Date = RealDate;

      expect(wrapper.emitted('update:start')).toEqual([[startMonth]]);
      expect(wrapper.emitted('update:range')).toEqual([[{ start: startMonth, end: dates.today }]]);
    });

    it('substracts start to 6 month and binds input', () => {
      wrapper.find('.dropdown-toggle').trigger('click');
      expect(
        wrapper
          .findAll('.btn-outline-primary')
          .at(2)
          .text()
      ).toEqual('Commandes depuis 6 mois');

      global.Date = jest.fn(() => dates.today);
      global.Date.setDate = RealDate.setDate;

      const startMonth = subMonths(dates.today, 6);

      wrapper
        .findAll('.btn-outline-primary')
        .at(2)
        .trigger('click');

      global.Date = RealDate;

      expect(wrapper.emitted('update:start')).toEqual([[startMonth]]);
      expect(wrapper.emitted('update:range')).toEqual([[{ start: startMonth, end: dates.today }]]);
    });

    it('substracts start to 1 year and binds input', () => {
      beforeEach(() => {});
      afterEach(() => {});
      wrapper.find('.dropdown-toggle').trigger('click');
      expect(
        wrapper
          .findAll('.btn-outline-primary')
          .at(3)
          .text()
      ).toEqual('Commandes depuis 1 an');

      global.Date = jest.fn(() => dates.today);
      global.Date.setDate = RealDate.setDate;

      const startMonth = subMonths(dates.today, 12);

      wrapper
        .findAll('.btn-outline-primary')
        .at(3)
        .trigger('click');

      global.Date = RealDate;

      expect(wrapper.emitted('update:start')).toEqual([[startMonth]]);
      expect(wrapper.emitted('update:range')).toEqual([[{ start: startMonth, end: dates.today }]]);
    });
  });
});
