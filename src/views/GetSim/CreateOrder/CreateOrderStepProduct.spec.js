import { mount } from '@vue/test-utils';
import { $t, $i18n } from '@/../tests-utils';
import CreateOrderStepProduct from './CreateOrderStepProduct';

const mocks = { $i18n, $t };

describe('CreateOrderStepProduct.vue', () => {
  /** @type {import('@vue/test-utils').Wrapper} */
  let wrapper;
  beforeEach(() => {
    const products = [
      {
        id: '01',
        name: 'SIM M2M Endurcie 076',
        format: 'Standard, sans PIN',
        patent: 'Best network + Smart Roaming',
        lastCommand: '12/01/2018',
      },
      {
        id: '02',
        name: 'SIM M2M Endurcie 075',
        format: 'Standard, sans PIN',
        patent: 'Backup FR',
        lastCommand: '12/01/2018',
      },
      {
        id: '03',
        name: 'SIM M2M Endurcie 024 (bobine de 3000)',
        format: 'Soudée, sans PIN',
        patent: 'Aucun',
        lastCommand: '12/01/2018',
      },
      {
        id: '04',
        name: 'SIM M2M Endurcie 079',
        format: 'Standard, sans PIN',
        patent: 'Best network + Smart Roaming',
        lastCommand: '12/01/2018',
      },
      {
        id: '05',
        name: 'SIM M2M Endurcie 096',
        format: 'Standard, sans PIN',
        patent: 'Backup FR',
        lastCommand: '12/01/2018',
      },
      {
        id: '06',
        name: 'SIM M2M Endurcie 047 (bobine de 3000)',
        format: 'Soudée, sans PIN',
        patent: 'Aucun',
        lastCommand: '12/01/2018',
      },
    ];

    wrapper = mount(CreateOrderStepProduct, {
      mocks,
    });

    wrapper.setData({ simTypes: products });
  });

  it('renders only the first 3 items when loaded', () => {
    expect(wrapper.findAll('.simtype')).toHaveLength(3);
  });

  it('adds active class to the clicked item', () => {
    wrapper
      .findAll('.simtype')
      .at(0)
      .find('input')
      .trigger('click');
    expect(
      wrapper
        .findAll('.simtype')
        .at(0)
        .classes()
    ).toContain('active');
  });
});
