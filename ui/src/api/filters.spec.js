import { fetchDeliveryCountries } from './filters';
import { query } from './utils';

jest.mock('./utils.js', () => ({
  query: jest.fn(),
}));

const defaultValue = {
  data: {
    countries: {
      countries: [
        { id: 1, code: 'ES', nameFr: 'Espagne', nameEn: 'Spain' },
        { id: 2, code: 'FR', nameFr: 'France', nameEn: 'France' },
      ],
      total: 0,
    },
  },
};

describe('api/filters', () => {
  beforeEach(() => {
    query.mockReset();
  });

  it('sorts by locale', async () => {
    query.mockResolvedValue(defaultValue);
    await fetchDeliveryCountries('fr');

    expect(query.mock.calls[0][1].sorting.nameFr).toEqual('ASC');

    await fetchDeliveryCountries('en');

    expect(query.mock.calls[1][1].sorting.nameEn).toEqual('ASC');
  });

  it('formats countries', async () => {
    query.mockResolvedValue(defaultValue);
    expect(await fetchDeliveryCountries('fr')).toEqual([
      { id: 1, code: 'ES', name: 'Espagne' },
      { id: 2, code: 'FR', name: 'France' },
    ]);
    expect(await fetchDeliveryCountries('en')).toEqual([
      { id: 1, code: 'ES', name: 'Spain' },
      { id: 2, code: 'FR', name: 'France' },
    ]);
  });
});
