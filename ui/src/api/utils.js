import axios from 'axios';
import moment from 'moment';
import get from 'lodash.get';

import store from '@/store';

import { isOnDebugMode } from '@/featureFlipping/plugin';

export const api = axios.create();

const WAIT_BEFORE_RETRY_IN_MS = 1000;

export async function mutation(name, params, ret = '') {
  function scan(obj) {
    let inputs = '';

    const keys = Object.keys(obj);
    for (let i = 0; i < keys.length; i++) {
      let value = obj[keys[i]];

      if ((!(value instanceof Object) && isNaN(value)) || value === undefined || value === null)
        continue;

      if (value instanceof Object && value.type !== 'enum') {
        inputs += `${keys[i]}:{${scan(value)}}`;
      } else {
        let val = value;
        if (typeof value === 'string') {
          val = `"${value}"`;
        }
        if (value instanceof Object && value.type === 'enum') {
          val = value.value;
        }
        inputs += `${keys[i]}: ${val}`;
      }

      if (i + 1 < keys.length) {
        inputs += ', ';
      }
    }

    return inputs;
  }

  const queryStr = `
  mutation {
    ${name}(${scan(params)})${ret}
  }`;

  console.log('queryStr>>', queryStr);

  return await query(queryStr);
}

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

  if (isOnDebugMode()) {
    console.log(q);
  }

  const singleTry = async () => {
    try {
      const res = await simpleQuery(q);
      return res;
    } catch (e) {
      if (e && e.response && e.response.status) {
        if (
          e.response.status === 401 ||
          e.response.status === 403 ||
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
    const baseUrl = process.env.VUE_APP_API_BASE_URL ? process.env.VUE_APP_API_BASE_URL : '';

    const response = await api.post(baseUrl + url, formData, config);
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

export function formattedValueFromSeconds(value) {
  let seconds = value;
  let duration = seconds;
  let hours = duration / 3600;
  duration = duration % 3600;
  let min = parseInt(duration / 60);
  duration = duration % 60;
  let sec = parseInt(duration);

  if (sec < 10) {
    sec = `0${sec}`;
  }
  if (min < 10) {
    min = `0${min}`;
  }
  if (parseInt(hours, 10) > 0) {
    return `${parseInt(hours, 10)}:${min}:${sec}`;
  }
  return `0${parseInt(hours, 10)}:${min}:${sec}`;
}

export function resumeFormattedValueFromSeconds(value) {
  let initialSeconds = value;
  let duration = initialSeconds;
  let days = duration / 86400;
  duration = duration % 86400;
  let hours = parseInt(duration / 3600);
  duration = duration % 3600;
  let min = parseInt(duration / 60);
  duration = duration % 60;
  let sec = parseInt(duration);

  if (sec < 10) {
    sec = `0${sec}`;
  }
  if (min < 10) {
    min = `0${min}`;
  }

  if (value > 86400) {
    if (hours > 9) {
      return `${parseInt(days)}j${parseInt(hours, 10)}h${min}min${sec}sec`;
    }
    return `${parseInt(days)}j0${parseInt(hours, 10)}h${min}min${sec}sec`;
  } else if (value < 86400 && value > 3600) {
    if (parseInt(hours, 10) > 0) {
      return `${parseInt(hours, 10)}h${min}min${sec}sec`;
    }
    return `0${parseInt(hours, 10)}h${min}min${sec}sec`;
  } else if (value === 0) {
    return `0`;
  } else {
    return `${min}min${sec}sec`;
  }
}

export function resumeFormattedValueFromHours(value) {
  let initialSeconds = value * 60 * 60;
  let duration = initialSeconds;
  let days = duration / 86400;
  duration = duration % 86400;
  let hours = parseInt(duration / 3600);

  if (initialSeconds > 86400) {
    if (hours > 9) {
      return `${parseInt(days)}j ${parseInt(hours, 10)}h`;
    }
    return `${parseInt(days)}j0${parseInt(hours, 10)}h`;
  } else if (initialSeconds < 86400 && initialSeconds > 3600) {
    if (parseInt(hours, 10) > 0) {
      return `${parseInt(hours, 10)}h`;
    }
    return `0${parseInt(hours, 10)}h`;
  } else if (initialSeconds === 0) {
    return `0`;
  } else {
    return ``;
  }
}
