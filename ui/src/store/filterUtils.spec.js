import { areFiltersIdentical, isFilterEq } from './filterUtils';

describe(`Comparaison sur 1 seul filtre`, () => {
  it(`Filtre avec valeurs multiples identiques`, () => {
    const filterToCheck = {
      id: 'filters.partners',
      values: [
        {
          id: 5,
          label: 'AUCHAN',
          code: '5.12648',
          name: 'AUCHAN',
          partyType: 'MVNO',
          suspensionFree: false,
        },
      ],
    };

    const result = isFilterEq(filterToCheck, { ...filterToCheck });
    expect(result).toBe(true);
  });

  it(`Filtre avec valeurs multiples différentes`, () => {
    const filterToCheck1 = {
      id: 'filters.partners',
      values: [
        {
          id: 5,
          label: 'AUCHAN',
          code: '5.12648',
          name: 'AUCHAN',
          partyType: 'MVNO',
          suspensionFree: false,
        },
      ],
    };

    const filterToCheck2 = {
      id: 'filters.partners',
      values: [
        {
          id: 2,
          label: 'Lyra',
          code: '5.12648',
          name: 'AUCHAN',
          partyType: 'MVNO',
          suspensionFree: false,
        },
      ],
    };

    const result = isFilterEq(filterToCheck1, filterToCheck2);
    expect(result).toBe(false);
  });

  it(`Filtre avec valeurs vides`, () => {
    const filterToCheck1 = {
      id: 'filters.partners',
      values: [],
    };

    const filterToCheck2 = {
      id: 'filters.partners',
      values: [],
    };

    const result = isFilterEq(filterToCheck1, filterToCheck2);
    expect(result).toBe(true);
  });
});

describe(`Filter utils: Comparer des filtres`, async () => {
  it(`Détecter que les filtres sonts identiques`, () => {
    const selectedFilters = [
      {
        id: 'filters.partners',
        values: [
          {
            id: 5,
            label: 'AUCHAN',
            code: '5.12648',
            name: 'AUCHAN',
            partyType: 'MVNO',
            suspensionFree: false,
          },
        ],
      },
      { id: 'filters.billingAccounts', values: [] },
      { id: 'filters.lines.associatedOffer', values: [] },
      { id: 'filters.customFields', values: [] },
    ];
    const filtersToCheck = [
      {
        id: 'filters.partners',
        values: [
          {
            id: 5,
            label: 'AUCHAN',
            code: '5.12648',
            name: 'AUCHAN',
            partyType: 'MVNO',
            suspensionFree: false,
          },
        ],
      },
      { id: 'filters.customFields', values: [] },
      { id: 'filters.billingAccounts', values: [] },
      { id: 'filters.lines.associatedOffer', values: [] },
    ];

    const result = areFiltersIdentical(selectedFilters, filtersToCheck);

    expect(result).toBe(true);
  });

  it(`Filtre partenaire présent mais valeurs différentes`, () => {
    const selectedFilters = [
      {
        id: 'filters.partners',
        values: [
          {
            id: 5,
            label: 'AUCHAN',
            code: '5.12648',
            name: 'AUCHAN',
            partyType: 'MVNO',
            suspensionFree: false,
          },
        ],
      },
      { id: 'filters.billingAccounts', values: [] },
      { id: 'filters.lines.associatedOffer', values: [] },
      { id: 'filters.customFields', values: [] },
    ];
    const filtersToCheck = [
      {
        id: 'filters.partners',
        values: [
          {
            id: 3,
            label: 'Lyra',
            code: '5.12648',
            name: 'AUCHAN',
            partyType: 'MVNO',
            suspensionFree: false,
          },
        ],
      },
      { id: 'filters.customFields', values: [] },
      { id: 'filters.billingAccounts', values: [] },
      { id: 'filters.lines.associatedOffer', values: [] },
    ];

    const result = areFiltersIdentical(selectedFilters, filtersToCheck);

    expect(result).toBe(false);
  });
});
