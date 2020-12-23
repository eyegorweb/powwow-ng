import { mount } from '@vue/test-utils';
import SelectedFilterDetails from './SelectedFilterDetails.vue';
import { $t } from '@/../tests-utils';

jest.mock('daterangepicker/daterangepicker.js', () => {});
jest.mock('daterangepicker/daterangepicker.css', () => {});

const mocks = { $t };

const startDate = '10/01/2019';
const endDate = '20/01/2019';

function factory() {
  return mount(SelectedFilterDetails, {
    mocks,
    propsData: {
      filter: {
        id: 'partners',
      },
    },
  });
}

describe('components/SelectedFilterDetails', () => {
  it('displays the id as title', () => {
    const wrapper = factory();
    expect(wrapper.text()).toContain('partners');
  });

  it('displays list of values', () => {
    const wrapper = factory();
    wrapper.setProps({
      filter: {
        id: 'partners',
        values: [{ id: 1, label: 'first' }, { id: 2, label: 'second' }, { id: 3, label: 'third' }],
      },
    });
    expect(wrapper.findAll('[data-test=content] span')).toHaveLength(3);
    expect(wrapper.find('[data-test=content]').text()).toContain('first');
    expect(wrapper.find('[data-test=content]').text()).toContain('second');
    expect(wrapper.find('[data-test=content]').text()).toContain('third');
  });

  it('displays a single value', () => {
    const wrapper = factory();
    wrapper.setProps({
      filter: {
        id: 'partners',
        value: 'foo',
      },
    });
    expect(wrapper.findAll('[data-test=content] span')).toHaveLength(1);
    expect(wrapper.find('[data-test=content]').text()).toBe('foo');
  });

  it('displays a date range', () => {
    // mock format to french
    const spy = jest.fn(key => {
      if (key === 'getsim.date-from-to-format') return 'dd/MM/yyyy';
      return key;
    });
    mocks.$t = spy;
    const wrapper = factory();
    const filter = {
      id: 'partners',
      startDate,
      endDate,
    };
    wrapper.setProps({
      filter,
    });
    mocks.$t = $t;
    expect(wrapper.findAll('[data-test=content] span')).toHaveLength(1);
    expect(spy).toHaveBeenCalledWith('getsim.date-from-to', {
      startDate: '10/01/2019',
      endDate: '20/01/2019',
    });
  });
});
