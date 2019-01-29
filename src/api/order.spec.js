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

  it('filters by quantity when from and to values are set', () => {
    const orderBy = {
      key: 'id',
      direction: 'DESC',
    };
    const pagination = {
      page: 1,
      limit: 10,
    };
    const filters = [{ id: 'filters.quantity', value: '5 → 50', from: '5', to: '50' }];
    searchOrders(orderBy, pagination, filters);
    const calledQuery = utils.query.mock.calls[0][0];
    expect(calledQuery).toContain('filter: {quantity: {goe: 5, loe: 50}}');
  });
  it('do not filter by quantity when the twi values are not set', () => {
    const orderBy = {
      key: 'id',
      direction: 'DESC',
    };
    const pagination = {
      page: 1,
      limit: 10,
    };
    const filters = [{ id: 'filters.quantity', from: '5' }];
    searchOrders(orderBy, pagination, filters);
    const calledQuery = utils.query.mock.calls[0][0];
    expect(calledQuery).not.toContain('filter: {quantity');
  });
});
