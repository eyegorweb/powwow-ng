import * as utils from './utils';

import { searchOrders } from './orders';

describe('order api', () => {
  beforeEach(() => {
    const response = {
      data: {
        orders: {
          total: 33,
          orders: [],
        },
      },
    };

    utils.query = jest.fn();
    utils.query.mockResolvedValue(response);
  });
  it('adds pagination and field paramters', () => {
    const fields = ['toto', 'titi'];
    const orderBy = {};
    const paginaton = {
      page: 1,
      limit: 10,
    };
    searchOrders(fields, orderBy, paginaton);

    const calledQuery = utils.query.mock.calls[0][0];
    expect(calledQuery).toContain('pagination: {page: 1, limit: 10}');
    expect(calledQuery).toContain('toto\ntiti');
  });

  it('adds sorting parameter', () => {
    const fields = ['toto', 'titi'];
    const orderBy = {
      key: 'id',
      direction: 'DESC',
    };
    const paginaton = {
      page: 1,
      limit: 10,
    };
    searchOrders(fields, orderBy, paginaton);

    const calledQuery = utils.query.mock.calls[0][0];
    expect(calledQuery).toContain('sorting: {id: DESC}');
  });
});
