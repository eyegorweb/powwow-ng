import { mount } from '@vue/test-utils';
import MultiSelectSearch from './MultiSelectSearch';
import sortBy from 'lodash.sortby';
import { $t } from '@/../tests-utils';

const partners = [
  {
    label: 'erdf linky prod',
    id: 0,
  },
  {
    label: 'erdf grdf usl-ouest',
    id: 1,
  },
  {
    label: 'erdf linky services',
    id: 2,
  },
  {
    label: 'GEOLOC SYSTEMS',
    id: 3,
  },
  {
    label: 'GEOMOBILE',
    id: 4,
  },
  {
    label: 'GEOTRACTEUR SARL',
    id: 5,
  },
];

const mocks = { $t };

const unselectAll = 'unSelectAll (6)';

describe('PartnersSearch', () => {
  /** @type {import('@vue/test-utils').Wrapper} */
  let wrapper;
  beforeEach(() => {
    wrapper = mount(MultiSelectSearch, {
      propsData: {
        items: [...partners],
        defaultSelectedItems: [],
        enableSelectAll: true,
      },
      mocks,
    });
  });

  /*
  NOTE: ce test va peut être sauter avec la nouvelle implementation
  it('keeps selected checkboxes in between searches', () => {
    // la premiere checkbox est tout selectioner
    wrapper
      .findAll('input[type=checkbox]')
      .at(2)
      .setChecked(true);
    wrapper.find('input[type=text]').setValue('erdf');
    expect(
      wrapper
        .findAll('input[type=checkbox]')
        .at(2)
        .is(':checked')
    ).toBe(true);
  });

  //*/

  it('adds all filtered values to empty array', () => {
    wrapper.find('input[type=text]').setValue('geo');
    wrapper.find('input[type=checkbox]').setChecked(true);
    // expect(sortBy(wrapper.vm.selectedItems, 'id')).toEqual(partners.slice(3, 6));
    const selectedItems = wrapper.emitted('update:defaultSelectedItems')[0][0];
    expect(sortBy(selectedItems, 'id')).toEqual(partners.slice(3, 6));
  });

  it('does not duplicate entries when selecting all', () => {
    wrapper.setProps({ defaultSelectedItems: [partners[3]] });

    wrapper.find('input[type=text]').setValue('geo');
    // NOTE bug avec test utils qui declenche checked puis unchecked
    // wrapper.find('input[type=checkbox]').setChecked(true);
    wrapper.vm.addAllToSelectedItems(partners.slice(3, 6), partners.slice(3, 6));
    //  expect(sortBy(wrapper.vm.selectedItems, 'id')).toEqual(partners.slice(3, 6));
    expect(wrapper.emitted('update:defaultSelectedItems')).toEqual([[partners.slice(3, 6)]]);
  });

  it('empties array when label is clicked', () => {
    wrapper.vm.selectedItems = [...partners];
    wrapper.find('input[type=checkbox]').setChecked(true);
    wrapper.find('input[type=checkbox]').setChecked(false);
    expect(sortBy(wrapper.vm.selectedItems, 'id')).toHaveLength(0);
  });

  it('only removes searched terms from array when label is clicked after a search', () => {
    wrapper.setProps({ defaultSelectedItems: [...partners] });
    wrapper.find('input[type=text]').setValue('erdf');
    // NOTE meme chose que le test précédant
    // wrapper.find('input[type=checkbox]').setChecked(false);
    wrapper.vm.addAllToSelectedItems([], partners.slice(0, 3));

    expect(wrapper.emitted('update:defaultSelectedItems')).toEqual([[partners.slice(3, 6)]]);
  });

  it('updates the label when all partners are selected', () => {
    wrapper.findAll('input[type=checkbox]:not(:first-child)').setChecked(true);
    expect(wrapper.emitted('update:defaultSelectedItems')).toBeTruthy();

    wrapper.setProps({ defaultSelectedItems: [...partners] }); // le composant parent renvoi la nouvelle selection d'items

    expect(wrapper.find('.checkbox-container label').text()).toEqual(
      expect.stringContaining(unselectAll)
    );
  });

  /*
  // NOTE : on va tester cela différement car le composant prends maintenant les valeurs cochées depus une props et non sa data
  it('updates the label when a partner is removed after all were selected', () => {
    wrapper.findAll('input[type=checkbox]:not(:first-child)').setChecked(true);
    wrapper
      .findAll('input[type=checkbox]')
      .at(2)
      .setChecked(false);
    expect(wrapper.find('.checkbox-container label').text()).toEqual(
      expect.not.stringContaining(unselectAll)
    );
  });
  //*/

  it('removes from the array an item that is clicked', () => {
    wrapper.setProps({ defaultSelectedItems: [...partners] });
    const itemToRemove = wrapper.findAll('.selection').at(1); // on se base sur un nombre maximum de partners fixé à 2
    itemToRemove.find('.remove-item').trigger('click');
    expect(wrapper.emitted('update:defaultSelectedItems')).toEqual([
      [
        [
          { label: 'erdf linky prod', id: 0 },
          { label: 'erdf linky services', id: 2 },
          { label: 'GEOLOC SYSTEMS', id: 3 },
          { label: 'GEOMOBILE', id: 4 },
          { label: 'GEOTRACTEUR SARL', id: 5 },
        ],
      ],
    ]);
  });
});
