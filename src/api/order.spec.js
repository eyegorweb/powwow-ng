import * as utils from './utils';

import { searchOrders, formatDateRangeFilter } from './orders';

// Parameters when values do not matter
const orderBy = {
  key: 'id',
  direction: 'DESC',
};
const pagination = {
  page: 1,
  limit: 10,
};

describe('order api', () => {
  let querySpy = jest.spyOn(utils, 'query');
  beforeEach(() => {
    const response = {
      data: {
        orders: {
          total: 33,
          orders: [],
        },
      },
    };

    querySpy.mockClear();
    querySpy.mockResolvedValue(response);
  });

  afterAll(() => {
    querySpy.mockRestore();
  });

  it('adds pagination and field paramters', async () => {
    const orderBy = {};
    const pagination = {
      page: 1,
      limit: 10,
    };
    await searchOrders(orderBy, pagination);

    const calledQuery = utils.query.mock.calls[0][0];
    expect(calledQuery).toContain('pagination: {page: 1, limit: 10}');
  });

  it('adds sorting parameter', async () => {
    const orderBy = {
      key: 'id',
      direction: 'DESC',
    };
    const pagination = {
      page: 1,
      limit: 10,
    };
    await searchOrders(orderBy, pagination);
    const calledQuery = utils.query.mock.calls[0][0];
    expect(calledQuery).toContain('sorting: {id: DESC}');
  });

  it('adds an orderDate paramater', async () => {
    await searchOrders(orderBy, pagination, [
      { id: 'filters.orderDate', startDate: 'start', endDate: 'end' },
    ]);
    expect(utils.query).toHaveBeenCalledTimes(1);
    const calledQuery = utils.query.mock.calls[0][0];
    expect(calledQuery).toContain('orderDate: {between: {startDate: "start", endDate: "end"}}');
  });

  describe('utils: formatDateRangeFilter', () => {
    it('supports between range by default', () => {
      expect(
        formatDateRangeFilter(
          [{ id: 'filters.orderDate', startDate: 'start', endDate: 'end' }],
          'filters.orderDate'
        )
      ).toBe(`{between: {startDate: "start", endDate: "end"}}`);
    });
  });
});
