import { shallowMount, mount } from '@vue/test-utils';
import MultiChoices from './MultiChoices.vue';

describe('components/Multichoices', () => {
  let wrapper;
  beforeEach(() => {
    const values = [
      {
        code: 'partners',
        label: 'Partenaires',
      },
      {
        code: 'orderDate',
        label: 'Date de la commande',
      },
    ];
    const selectedValues = [];

    /** @type {import('@vue/test-utils').Wrapper} */
    wrapper = mount(MultiChoices, {
      propsData: {
        values,
        selectedValues,
      },
    });
  });
  it('Should show multiple choices', () => {
    expect(wrapper.findAll('input')).toHaveLength(2);
  });

  it('Should emit event with selected choices only ', () => {
    const allInputs = wrapper.findAll('input');
    allInputs.at(0).element.checked = true;
    allInputs.at(0).trigger('change');

    allInputs.at(1).element.checked = true;
    allInputs.at(1).trigger('change');

    expect(wrapper.emitted()['update:selectedValues']).toBeTruthy();
    expect(wrapper.emitted()['update:selectedValues']).toHaveLength(2);
  });
});
