import { mount } from '@vue/test-utils';
import { $t, $i18n } from '@/../tests-utils';
import GetSimTypeOption from './GetSimTypeOption';

const mocks = { $i18n, $t };

const simType = {
  id: '02',
  name: 'SIM M2M Endurcie 075',
  format: 'Standard, sans PIN',
  patent: 'Backup FR',
  lastCommand: '12/01/2018',
};

// describe('GetSimTypeOption.vue', () => {
//   /** @type {import('@vue/test-utils').Wrapper} */
//   let wrapper;
//   beforeEach(() => {
//     wrapper = mount(GetSimTypeOption, {
//       propsData: { item: simType },
//       mocks,
//     });
//     wrapper.find('input').value = simType;
//   });

//   it('has active class when clicked', () => {
//     console.log('simTypeTest', wrapper.find('input').value);
//     expect(
//       wrapper
//         .findAll('div')
//         .at(0)
//         .classes()
//     ).toContain('active');
//   });
// });
