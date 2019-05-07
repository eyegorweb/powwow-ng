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
    expect(query).toHaveBeenCalledWith(expect.stringContaining('nameFr: ASC'));
    await fetchDeliveryCountries('en');
    expect(query).toHaveBeenLastCalledWith(expect.stringContaining('nameEn: ASC'));
  });

  it('only requires the necessary code', async () => {
    query.mockResolvedValue(defaultValue);
    await fetchDeliveryCountries('fr');
    expect(query).toHaveBeenCalledWith(
      expect.stringContaining(`
      countries {
        id
        code
        nameFr
      }
    `)
    );
    await fetchDeliveryCountries('en');
    expect(query).toHaveBeenLastCalledWith(
      expect.stringContaining(`
      countries {
        id
        code
        nameEn
      }
    `)
    );
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
