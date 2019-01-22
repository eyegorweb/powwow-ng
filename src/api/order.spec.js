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
    const orderBy = {};
    const pagination = {
      page: 1,
      limit: 10,
    };
    searchOrders(orderBy, pagination);

    const calledQuery = utils.query.mock.calls[0][0];
    expect(calledQuery).toContain('pagination: {page: 1, limit: 10}');
  });

  it('adds sorting parameter', () => {
    const orderBy = {
      key: 'id',
      direction: 'DESC',
    };
    const pagination = {
      page: 1,
      limit: 10,
    };
    searchOrders(orderBy, pagination);
    const calledQuery = utils.query.mock.calls[0][0];
    expect(calledQuery).toContain('sorting: {id: DESC}');
  });
});
