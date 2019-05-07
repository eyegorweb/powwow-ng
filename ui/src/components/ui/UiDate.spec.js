import { mount } from '@vue/test-utils';
import UiDate from './UiDate.vue';

jest.mock('flatpickr/dist/flatpickr.min.css', () => {});

// dates to use in tests
const dates = {
  september: new Date(2018, 9, 27),
  october: new Date(2018, 10, 27),
  december: new Date(2018, 12, 27),
  nextYearJanuary: new Date(2019, 1, 27),
  today: new Date(2018, 12, 27),
};

describe('UiDate', () => {
  /** @type {import('@vue/test-utils').Wrapper} */
  let wrapper;
  beforeEach(() => {
    wrapper = mount(UiDate, {
      propsData: { dateValue: null },
    });
  });

  describe('null as initial value', () => {
    it('sets date', () => {
      expect(wrapper.emitted('update:dateValue')).toBeUndefined();
    });
  });

  describe('date as initial value', () => {
    beforeEach(() => {
      wrapper.setProps({
        dateValue: dates.september,
      });
    });

    it('sets date', () => {
      wrapper.vm.onChange([dates.september]);
      expect(wrapper.emitted('update:dateValue')).toEqual([[dates.september]]);
    });
  });
});
