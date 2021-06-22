import { mount } from '@vue/test-utils';
import MultiChoices from './MultiChoices.vue';

describe('components/Multichoices', () => {
  let wrapper;
  beforeEach(() => {
    const options = [
      {
        code: 'partners',
        label: 'Partenaires',
        data: {
          editable: true,
        },
      },
      {
        code: 'orderDate',
        label: 'Date de la commande',
        data: {
          editable: true,
        },
      },
    ];
    const value = [];

    /** @type {import('@vue/test-utils').Wrapper} */
    wrapper = mount(MultiChoices, {
      propsData: {
        options,
        value,
      },
    });
  });
  it('shows multiple choices', () => {
    expect(wrapper.findAll('input')).toHaveLength(2);
  });

  it('emits event with selected choices only ', () => {
    const allInputs = wrapper.findAll('input');
    allInputs.at(0).element.checked = true;
    allInputs.at(0).trigger('change');

    allInputs.at(1).element.checked = true;
    allInputs.at(1).trigger('change');

    expect(wrapper.emitted()['input']).toBeTruthy();
    expect(wrapper.emitted()['input']).toHaveLength(2);
  });
});
