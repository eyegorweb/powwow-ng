import { mount } from '@vue/test-utils';
import UiApiAutocomplete from './UiApiAutocomplete';
import fakePromise from 'faked-promise';

const apiMethod = jest.fn();
jest.useFakeTimers();

describe('UiApiAutocomplete.vue', () => {
  /** @type {import('@vue/test-utils').Wrapper} */
  let wrapper, resolve;
  beforeEach(() => {
    const [promise, resolvePromise /*, rejectPromise*/] = fakePromise();
    resolve = () =>
      resolvePromise([
        { id: 0, label: 'option 1' },
        { id: 1, label: 'option 2' },
        { id: 2, label: 'option 3' },
      ]);
    apiMethod.mockReset();
    apiMethod.mockReturnValue(promise);
    wrapper = mount(UiApiAutocomplete, {
      propsData: { apiMethod },
      value: '',
    });
  });
  afterEach(() => {
    jest.clearAllTimers();
  });

  it('displays a message when the input is empty', () => {
    expect(wrapper.find('.autocomplete-results').text()).toMatch('pour avoir des suggestions');
  });

  it('shows up suggestions when input is focused', () => {
    expect(wrapper.find('.autocomplete-results').isVisible()).toBe(false);
    wrapper.find('input').trigger('focus');
    expect(wrapper.find('.autocomplete-results').isVisible()).toBe(true);
  });

  it('syncs the value', () => {
    wrapper.setProps({ value: 'rue Rivoli' });
    expect(wrapper.find('input').element.value).toBe('rue Rivoli');
    wrapper.find('input').setValue('rue Oberkampf');
    // setChecked emet deux évemenements...
    expect(wrapper.emitted('update:value')).toEqual([['rue Oberkampf']]);
  });

  it('displays suggestions upon typing', async () => {
    expect(apiMethod).not.toHaveBeenCalled();
    wrapper.setProps({ value: 'Paris' });
    expect(apiMethod).toHaveBeenCalled();
    expect(wrapper.findAll('.autocomplete-result')).toHaveLength(0);
    await resolve();
    // await wrapper.vm.$nextTick();
    expect(wrapper.findAll('.autocomplete-result')).toHaveLength(3);
  });

  describe('with suggestions', () => {
    beforeEach(async () => {
      // simulate changing the value while being in focus
      wrapper.find('input').trigger('focus');
      // il semble etre nécessaire d'appeler les deux
      wrapper.find('input').element.focus();
      wrapper.setProps({ value: 'Paris' });
      await resolve();
    });

    it('selects a value on click then hides suggestions', () => {
      expect(wrapper.find('input').is(':focus')).toBe(true);
      expect(wrapper.find('.autocomplete-results').isVisible()).toBe(true);
      wrapper.find('.autocomplete-result').trigger('click');
      expect(wrapper.emitted('update:value')).toEqual([['option 1']]);
      expect(wrapper.find('.autocomplete-results').isVisible()).toBe(false);
      expect(wrapper.find('input').is(':focus')).toBe(true);
    });

    it('can be selected with keyboard', () => {
      expect(wrapper.find('.autocomplete-result.is-selected').exists()).toBe(false);
      wrapper.find('input').trigger('keydown.down');
      expect(wrapper.find('.autocomplete-result.is-selected').exists()).toBe(true);
      expect(wrapper.find('.autocomplete-result.is-selected').text()).toBe('option 1');
      wrapper.find('input').trigger('keydown.down');
      expect(wrapper.find('.autocomplete-result.is-selected').text()).toBe('option 2');
    });

    it('does not go above limits', () => {
      wrapper.find('input').trigger('keydown.down');
      wrapper.find('input').trigger('keydown.up');
      expect(wrapper.find('.autocomplete-result.is-selected').text()).toBe('option 1');
      wrapper.find('input').trigger('keydown.down');
      expect(wrapper.find('.autocomplete-result.is-selected').text()).toBe('option 2');
      wrapper.find('input').trigger('keydown.down');
      expect(wrapper.find('.autocomplete-result.is-selected').text()).toBe('option 3');
      wrapper.find('input').trigger('keydown.down');
      expect(wrapper.find('.autocomplete-result.is-selected').text()).toBe('option 3');
    });

    it('only one item is selected on hover', () => {
      wrapper.find('input').trigger('keydown.down');
      expect(wrapper.find('.autocomplete-result.is-selected').text()).toBe('option 1');
      wrapper
        .findAll('.autocomplete-result')
        .at(2)
        .trigger('mouseenter');
      expect(wrapper.find('.autocomplete-result.is-selected').text()).toBe('option 3');
    });

    it('only one item is selected on arrow keys after hover', () => {
      wrapper
        .findAll('.autocomplete-result')
        .at(0)
        .trigger('mouseenter');
      expect(wrapper.find('.autocomplete-result.is-selected').text()).toBe('option 1');
      wrapper.find('input').trigger('keydown.down');
      expect(wrapper.find('.autocomplete-result.is-selected').text()).toBe('option 2');
    });

    it('hides suggestions when focusing something else', () => {
      // relatedTarget est l'élément vers lequel prend le focus.
      wrapper.find('input').trigger('blur', { relatedTarget: {} });
      expect(wrapper.find('.autocomplete-results').isVisible()).toBe(false);
    });
  });
});
