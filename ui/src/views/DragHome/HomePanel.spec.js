import { mount } from '@vue/test-utils';
import HomePanel from './HomePanel';

import { $t } from '@/../tests-utils';

const mocks = { $t };

describe('HomePanel', () => {
  /** @type {import('@vue/test-utils').Wrapper} */
  let wrapper;
  beforeEach(() => {
    const isOpen = false;
    const widgets = [
      {
        id: 'w1',
        title: 'En cours de consomation',
        description: 'Description',
        checked: false,
        large: true,
      },
    ];
    wrapper = mount(HomePanel, {
      mocks,
      propsData: {
        widgets,
        isOpen,
      },
    });
  });

  it('sends an up to date array of widgets to show and close the panel on click over save button', () => {
    wrapper.setProps({
      isOpen: true,
    });

    wrapper.find('.home-panel-option').trigger('click');
    wrapper.find('.btn-primary').trigger('click'); // save button

    expect(wrapper.emitted('update:isOpen')).toEqual([[false]]);
    expect(wrapper.emitted('update:widgets')).toEqual([
      [
        [
          {
            id: 'w1',
            title: 'En cours de consomation',
            description: 'Description',
            checked: true,
            large: true,
          },
        ],
      ],
    ]);
  });

  it('updates the list of widgets to show when opening panel', () => {
    expect(wrapper.findAll('.cd-panel__content .card')).toHaveLength(0);
    wrapper.setProps({
      isOpen: true,
    });
    expect(wrapper.findAll('.cd-panel__content .card')).toHaveLength(1);
  });
});
