import { mount } from '@vue/test-utils';
import { $t, $i18n } from '@/../tests-utils';
import CreateOrderStepProduct from './CreateOrderStepProduct';
import * as api from '@/api/products';

const mocks = { $i18n, $t };

const products = [
  {
    simCard: {
      id: '76',
      name: 'M2M sim avec code pin',
    },
  },
  {
    simCard: {
      id: '78',
      name: 'M2M sim antivol avec code pin bobine',
    },
  },
  {
    simCard: {
      id: '79',
      name: 'M2M sim antivol sans code pin',
    },
  },
];

const selectedObject = {
  product: {
    label: 'common.product',
    selection: { product: { simCard: { id: '76', name: 'M2M sim avec code pin' } } },
    value: { content: ['M2M sim avec code pin'], id: '76' },
  },
  quantity: {
    label: 'common.quantity',
    selection: { quantity: '4' },
    value: { content: '4', id: 'quantity' },
  },
};

const props = {
  synthesis: {
    billingAccount: {
      value: {
        partnerId: 1,
      },
    },
  },
};

describe('CreateOrderStepProduct.vue', () => {
  /** @type {import('@vue/test-utils').Wrapper} */
  let wrapper;
  beforeEach(() => {
    api.fetchSim = jest.fn();
    api.fetchSim.mockResolvedValue(products);

    wrapper = mount(CreateOrderStepProduct, {
      mocks,
      propsData: { ...props },
    });

    wrapper.setData({ selectedNumberOfSims: 4 });
  });

  it('renders only the first 3 items when loaded', () => {
    expect(wrapper.findAll('.simtype')).toHaveLength(3);
  });

  it('displays all items when the link is clicked', () => {
    wrapper.find('.show-all-types').trigger('click');
    expect(wrapper.findAll('.simtype')).toHaveLength(products.length);
  });

  it('adds active class to the clicked item', () => {
    wrapper
      .findAll('.simtype')
      .at(0)
      .find('input')
      .trigger('click');
  });

  it('emits an event with the correct payload', () => {
    console.log(wrapper.html());
    wrapper.find('input[type=number]').setValue(4);

    wrapper
      .findAll('.simtype')
      .at(0)
      .find('input')
      .trigger('click');

    wrapper
      .findAll('button')
      .at(1)
      .trigger('click');

    expect(wrapper.emitted('done')).toContainEqual([selectedObject]);
  });
});
