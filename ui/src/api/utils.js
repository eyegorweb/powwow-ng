import axios from 'axios';
import moment from 'moment';
import get from 'lodash.get';

import store from '@/store';

export const api = axios.create();

const WAIT_BEFORE_RETRY_IN_MS = 1000;

/**
 *  Besoin de gérer les erreurs
 */
export async function simpleQuery(q) {
  const haveToken = get(api, 'defaults.headers.common.Authorization');
  if (!haveToken) return;
  const response = await api.post(process.env.VUE_APP_GQL_SERVER_URL, { query: q });
  return response.data;
}

export async function query(q) {
  let tries = 10;

  const singleTry = async () => {
    try {
      const res = await simpleQuery(q);
      return res;
    } catch (e) {
      if (e && e.response && e.response.status) {
        if (
          e.response.status === 401 ||
          e.response.status === 403 ||
          e.response.status === 503 ||
          e.response.status === 504 ||
          (e.response && e.response.error && e.response.error === 'invalid_token')
        ) {
          if (tries > 0) {
            tries -= 1;
            store.commit('startRefreshingToken');
            await delay(WAIT_BEFORE_RETRY_IN_MS);
            return await singleTry();
          }
        }
      }
    }
  };

  return await singleTry();
}

export async function postFile(url, formData) {
  try {
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };
    const response = await api.post(url, formData, config);
    return response.data;
  } catch (e) {
    return { error: e.message };
  }
}

export async function queryHandleErros(q) {
  try {
    return await api.post(process.env.VUE_APP_GQL_SERVER_URL, { query: q });
  } catch (e) {
    // TODO: COrrectly test this
    // store.commit('startRefreshingToken');
  }
}

export function delay(t) {
  return new Promise(resolve => setTimeout(resolve, t));
}

export function addDateFilter(gqlFilters, selectedFilters, gqlParamName, filterKey) {
  const dateFilter = selectedFilters.find(f => f.id === filterKey);
  if (dateFilter && dateFilter.startDate && dateFilter.endDate) {
    const formattedStartDate = `${formatDateForGql(dateFilter.startDate)}`;

    const formattedEndDate = `${prepareEndDateForBackend(dateFilter.endDate)}`;

    gqlFilters.push(
      `${gqlParamName}: {between: {startDate: "${formattedStartDate}", endDate: "${formattedEndDate}"}}`
    );
  }

  function prepareEndDateForBackend(inDate) {
    const dateToEdit = inDate.replace(/\//g, '/');
    const parts = dateToEdit.split(' ');
    let endDate;
    let formatToUse;

    if (parts.length === 2) {
      formatToUse = 'DD/MM/YYYY hh:mm:ss';
      endDate = moment(dateToEdit, formatToUse);
      if (!dateFilter.sameDay) {
        endDate = endDate.add(1, 'days');
      }
      return endDate.format(formatToUse);
    } else {
      formatToUse = 'DD/MM/YYYY';
      endDate = moment(`${parts[0]}`, formatToUse);
      if (!dateFilter.sameDay) {
        endDate = endDate.add(1, 'days');
      }
      return endDate.format(formatToUse) + ' 00:00:00';
    }
  }
}

export function formatDateForGql(inDate) {
  if (!inDate) return '';
  const startDate = inDate.replace(/\//g, '/');
  const parts = startDate.split(' ');
  if (parts) {
    return `${parts[0]}`;
    /*
    if (parts.length === 2) {
      return startDate;
    } else {
      return `${parts[0]} 00:00:00`;
    }
    //*/
  }
}

export function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 octet';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['octet', 'Ko', 'Mo', 'Go', 'To'];

  const index = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, index)).toFixed(dm))} ${sizes[index]}`;
}

export function boolStr(value) {
  return value ? 'true' : 'false';
}

export function getValuesIdsWithoutQuotes(filters, filterId) {
  const values = getFilterValues(filters, filterId);
  if (values) {
    return values.map(i => `${i.id}`).join(',');
  }
}

export function getFilterValues(filters, filterId) {
  if (!filters) return;

  const foundFilter = filters.find(f => f.id === filterId);
  if (foundFilter) {
    return foundFilter.values;
  }
}

export function getFilterValue(filters, filterId) {
  if (!filters) return;

  const foundFilter = filters.find(f => f.id === filterId);
  if (foundFilter) {
    return foundFilter.value;
  }
}

export function getValuesIds(filters, filterId) {
  const values = getFilterValues(filters, filterId);
  if (values) {
    return values.map(i => `"${i.id}"`).join(',');
  }
}

export function formatServicesForGQL(servicesChoice) {
  const dataServiceChoice = servicesChoice.data;
  const services = servicesChoice.services;

  let serviceParamsArr = [];
  let gqlServicesParamGql = '';
  if (dataServiceChoice) {
    if (dataServiceChoice.checked) {
      const paramsArr = dataServiceChoice.parameters
        .filter(p => p.selected)
        .map(p => `"${p.code}"`);
      serviceParamsArr.push(`{serviceCode: "DATA", serviceParameters: [${paramsArr.join(',')}]}`);
    }
  }

  if (services) {
    const checkedServices = services.filter(s => s.checked).map(s => `{serviceCode: "${s.code}"}`);
    serviceParamsArr = [...serviceParamsArr, ...checkedServices];
  }

  if (serviceParamsArr && serviceParamsArr.length) {
    gqlServicesParamGql = `, services:[${serviceParamsArr.join(',')}]`;
  }

  return gqlServicesParamGql;
}
