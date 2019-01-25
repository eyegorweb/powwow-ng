import * as filterModule from './filters.module';
import * as api from '@/api/customFields';

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
    it('sets applied filters', () => {
      const state = {
        currentFilters: [
          {
            id: 'filter1',
          },
          {
            id: 'filter2',
          },
        ],
        appliedFilters: [],
      };
      filterModule.mutations.applyFilters(state);

      expect(state.appliedFilters).toEqual([
        {
          id: 'filter1',
        },
        {
          id: 'filter2',
        },
      ]);
    });
    it('should add a new entry to selected filters when a new value is set', () => {
      const state = {
        currentFilters: [],
      };

      const payload = {
        id: 'partners',
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
          id: 'partners',
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

  describe('actions', () => {
    it('apply filters after clearing finter values', () => {
      const store = {
        commit: jest.fn(),
        getters: {
          selectedBillingAccountsValues: [],
          selectedOffersValues: [],
          selectedOrderCreatorValues: [],
        },
      };
      filterModule.actions.clearFilter(store, 'filters.offers');

      expect(store.commit.mock.calls[0]).toEqual([
        'selectFilterValue',
        {
          id: 'filters.offers',
          newValue: [],
        },
      ]);
      expect(store.commit.mock.calls[1]).toEqual(['applyFilters']);
    });

    it('sets partner filter with empty values', () => {
      const store = {
        commit: jest.fn(),
        getters: {
          selectedBillingAccountsValues: [],
          selectedOffersValues: [],
          selectedOrderCreatorValues: [],
        },
      };
      filterModule.actions.setPartnersFilter(store, []);

      expect(store.commit.mock.calls[0]).toEqual([
        'selectFilterValue',
        { id: 'filters.partners', newValue: [] },
      ]);

      expect(store.commit.mock.calls[1]).toEqual(['setBillingAccountsFilter', []]);
      expect(store.commit.mock.calls[2]).toEqual(['setOffersFilter', []]);
      expect(store.commit.mock.calls[3]).toEqual(['setOrderCreatorFilter', []]);
      expect(store.commit.mock.calls[4]).toEqual(['setFilterCustomFieldsList', []]);
    });

    it('should remove billingAccounts, offers and orderCreators', () => {
      const store = {
        commit: jest.fn(),
        getters: {
          selectedBillingAccountsValues: [
            {
              name: 'CF to remove',
              partnerId: 2,
            },
            {
              name: 'CF to keep',
              partnerId: 1,
            },
          ],
          selectedOffersValues: [
            {
              name: 'Offer to remove',
              partnerId: 2,
            },
            {
              name: 'Offer to keep',
              partnerId: 1,
            },
          ],
          selectedOrderCreatorValues: [
            {
              name: 'User to remove',
              partnerId: 2,
            },
            {
              name: 'User to keep',
              partnerId: 1,
            },
          ],
        },
      };
      const partners = [
        {
          name: 'partner 1',
          id: 1,
        },
        {
          name: 'partner 3',
          id: 3,
        },
      ];

      filterModule.actions.setPartnersFilter(store, partners);

      expect(store.commit.mock.calls[1]).toEqual([
        'setBillingAccountsFilter',
        [
          {
            name: 'CF to keep',
            partnerId: 1,
          },
        ],
      ]);
      expect(store.commit.mock.calls[2]).toEqual([
        'setOffersFilter',
        [
          {
            name: 'Offer to keep',
            partnerId: 1,
          },
        ],
      ]);
      expect(store.commit.mock.calls[3]).toEqual([
        'setOrderCreatorFilter',
        [
          {
            name: 'User to keep',
            partnerId: 1,
          },
        ],
      ]);
    });

    it('should refresh custom fields when one only one partner is selected', async () => {
      const store = {
        commit: jest.fn(),
        getters: {
          selectedBillingAccountsValues: [],
          selectedOffersValues: [],
          selectedOrderCreatorValues: [],
        },
      };
      const partners = [
        {
          name: 'partner 1',
          id: 1,
        },
      ];

      const mockCustomFields = [
        {
          name: 'custom field 1',
          type: 'text',
        },
      ];

      api.fetchCustomFields = jest.fn();
      api.fetchCustomFields.mockResolvedValue(mockCustomFields);

      await filterModule.actions.setPartnersFilter(store, partners);

      expect(store.commit.mock.calls[4]).toEqual([
        'setFilterCustomFieldsList',
        [
          {
            name: 'custom field 1',
            type: 'text',
          },
        ],
      ]);
    });
  });
});
