import * as filterModule from './filters.module';

describe('store/filters.module', () => {
  describe('getters', () => {
    it('should get values from the state', () => {
      const state = {
        allAvailableFilters: 'lulu',
        currentFilters: [
          {
            name: 'partners',
            values: [
              {
                code: 'c1',
                label: 'partner1',
              },
            ],
          },
        ],
      };
      expect(filterModule.getters.allAvailableFilters(state)).toBe('lulu');
      expect(filterModule.getters.currentFilters(state)).toEqual([
        {
          name: 'partners',
          values: [
            {
              code: 'c1',
              label: 'partner1',
            },
          ],
        },
      ]);
      expect(filterModule.getters.canShowSelectedFilter(state)).toBe(true);
    });
  });
  describe('mutations', () => {
    it('should add a new entry to selected filters when a new value is set', () => {
      const state = {
        currentFilters: [],
      };

      const payload = {
        name: 'partners',
        newValue: [
          {
            code: 'c1',
            label: 'partner1',
          },
        ],
      };

      filterModule.mutations.selectFilterValue(state, payload);

      expect(state.currentFilters).toHaveLength(1);
      expect(state.currentFilters).toEqual([
        {
          name: 'partners',
          values: [
            {
              code: 'c1',
              label: 'partner1',
            },
          ],
        },
      ]);
    });
    it('Should add a new value to an already selected filter', () => {
      const state = {
        currentFilters: [
          {
            name: 'partners',
            values: [
              {
                code: 'c1',
                label: 'partner1',
              },
            ],
          },
        ],
      };

      const payload = {
        name: 'partners',
        newValue: [
          {
            code: 'c1',
            label: 'partner1',
          },
          {
            code: 'c2',
            label: 'new option',
          },
        ],
      };

      filterModule.mutations.selectFilterValue(state, payload);
      expect(state.currentFilters).toHaveLength(1);

      expect(state.currentFilters).toEqual([
        {
          name: 'partners',
          values: [
            {
              code: 'c1',
              label: 'partner1',
            },
            {
              code: 'c2',
              label: 'new option',
            },
          ],
        },
      ]);
    });
  });
});
