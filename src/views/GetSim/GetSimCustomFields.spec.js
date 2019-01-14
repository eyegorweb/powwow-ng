import { mount } from '@vue/test-utils';
import { Store } from 'vuex-mock-store';
import GetSimCustomFields from './GetSimCustomFields';

jest.mock('flatpickr/dist/flatpickr.min.css', () => {});

describe('GetSimCustomFields', () => {
  it('display custom field depending on type', () => {
    const store = new Store({
      getters: {
        filterCustomFields: [
          {
            id: 'f1',
            type: 'input',
            label: 'nom',
          },
          {
            id: 'f2',
            type: 'listchoices',
            label: 'faction',
            value: ['lesZinsZins', 'pioupiouEtCie'],
          },
          {
            id: 'f3',
            type: 'date',
            label: 'birthday',
          },
        ],
      },
    });

    const wrapper = mount(GetSimCustomFields, {
      mocks: {
        $store: store,
      },
    });

    const html = wrapper.html();
    expect(html).toContain('<input type="text" placeholder="Commencer à saisir">');
    expect(html).toContain(
      '<select class="form-control mb-2"><option disabled="disabled" selected="selected" value="">Choisissez une valeur</option> <option value="lesZinsZins">lesZinsZins</option><option value="pioupiouEtCie">pioupiouEtCie</option></select>'
    );
    expect(wrapper.find('.flatpickr-input').exists()).toBe(true);
  });
});
