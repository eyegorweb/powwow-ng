import * as utils from './utils';

import { searchOrders } from './orders';

// Parameters when values do not matter
const orderBy = {
  key: 'id',
  direction: 'DESC',
};
const pagination = {
  page: 1,
  limit: 10,
};

const startDate = '10/01/2019';
const endDate = '20/01/2019';

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
    await searchOrders(orderBy, pagination, [{ id: 'filters.orderDate', startDate, endDate }]);
    expect(utils.query).toHaveBeenCalledTimes(1);
    const calledQuery = utils.query.mock.calls[0][0];
    expect(calledQuery).toContain(
      'orderDate: {between: {startDate: "10-01-2019 00:00:00", endDate: "21-01-2019 00:00:00"}}'
    );
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
  it('filters with quantity when only the start value is set', () => {
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
    expect(calledQuery).not.toContain('filter: {quantity:{ goe:');
  });

  it('filters with quantity when only the end value is set', () => {
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
    expect(calledQuery).not.toContain('filter: {quantity:{ loe:');
  });

  it('filters with line status when only the end value is set', () => {
    const orderBy = {
      key: 'id',
      direction: 'DESC',
    };
    const pagination = {
      page: 1,
      limit: 10,
    };
    const filters = [
      {
        id: 'filters.action',
        values: [
          {
            id: 'action.active',
            label: 'Activé',
            value: true,
          },
        ],
      },
    ];
    searchOrders(orderBy, pagination, filters);
    const calledQuery = utils.query.mock.calls[0][0];
    expect(calledQuery).toContain('filter: {activationAsked: {eq: true}');
  });

  it('filters with city only when the end value is set', () => {
    const orderBy = {
      key: 'id',
      direction: 'DESC',
    };
    const pagination = {
      page: 1,
      limit: 10,
    };
    const filters = [
      {
        id: 'filters.city',
        value: 'LABEGE',
      },
    ];
    searchOrders(orderBy, pagination, filters);
    const calledQuery = utils.query.mock.calls[0][0];
    expect(calledQuery).toContain('filter: {city: {startsWith: "LABEGE"}}');
  });

  it('filters with postalCode only when the end value is set', () => {
    const orderBy = {
      key: 'id',
      direction: 'DESC',
    };
    const pagination = {
      page: 1,
      limit: 10,
    };
    const filters = [
      {
        id: 'filters.postalCode',
        value: '31673',
      },
    ];
    searchOrders(orderBy, pagination, filters);
    const calledQuery = utils.query.mock.calls[0][0];
    expect(calledQuery).toContain('filter: {zipCode: {startsWith: "31673"}}');
  });

  it('filters with order status only when a value is set', () => {
    const orderBy = {
      key: 'id',
      direction: 'DESC',
    };
    const pagination = {
      page: 1,
      limit: 10,
    };
    const filters = [
      {
        id: 'filters.orderStatus',
        values: [
          { id: 'TO_BE_CONFIRMED', label: 'À confirmer' },
          { id: 'NOT_VALIDATED', label: 'Non validée' },
        ],
      },
    ];
    searchOrders(orderBy, pagination, filters);
    const calledQuery = utils.query.mock.calls[0][0];
    expect(calledQuery).toContain('status: {in: [TO_BE_CONFIRMED,NOT_VALIDATED]}');
  });

  it('filters with offers only when a value is set', () => {
    const orderBy = {
      key: 'id',
      direction: 'DESC',
    };
    const pagination = {
      page: 1,
      limit: 10,
    };
    const filters = [
      {
        id: 'filters.partners',
        values: [{ id: '2', label: 'LYRA NETWORK' }],
      },
      {
        id: 'filters.offers',
        values: [{ id: 'LYRA_PARC1_COMPTEUR_TEST', label: 'Parc 1 compteur' }],
      },
    ];
    searchOrders(orderBy, pagination, filters);
    const calledQuery = utils.query.mock.calls[0][0];
    expect(calledQuery).toContain(
      'partyId: {in:["2"]},workflowCode: {in: ["LYRA_PARC1_COMPTEUR_TEST"]}'
    );
  });
});
