import axios from 'axios';
import moment from 'moment';
import get from 'lodash.get';

import store from '@/store';

import { isOnDebugMode } from '@/featureFlipping/plugin';
import { getBaseURL } from '@/utils.js';

export const api = axios.create();

const WAIT_BEFORE_RETRY_IN_MS = 1000;

/**
 *  Besoin de gérer les erreurs
 */

export async function query(q, variables) {
  if (isOnDebugMode()) {
    let logStr = `
    ** requête **
    ${q}
    `;

    if (variables) {
      logStr += `
      ** paramètres **
      ${JSON.stringify(variables)}


      `;
    }
    console.log(logStr);
  }

  return await doAndRetryHTTPQuery(async () => {
    const haveToken = get(api, 'defaults.headers.common.Authorization');
    if (!haveToken) return;
    const payload = { query: q };
    if (variables) {
      payload.variables = variables;
    }
    const response = await api.post(process.env.VUE_APP_GQL_SERVER_URL, payload);
    return response.data;
  });
}

async function doAndRetryHTTPQuery(callFn) {
  let tries = 10;

  const singleTry = async () => {
    try {
      return await callFn();
    } catch (e) {
      if (e.response.status === 503 || e.response.status === 500) {
        throw e.response.status;
      }
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
  return doAndRetryHTTPQuery(async () => {
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };
    const response = await api.post(getBaseURL() + url, formData, config);
    return response.data;
  });
}

export function delay(t) {
  return new Promise(resolve => setTimeout(resolve, t));
}

export function addDateFilter(gqlFilters, selectedFilters, gqlParamName, filterKey) {
  const dateFilter = selectedFilters.find(f => f.id === filterKey);
  if (dateFilter && dateFilter.startDate) {
    const formattedStartDate = `${formatDateForGql(dateFilter.startDate)}`;
    if (dateFilter.endDate) {
      gqlFilters.push(
        `${gqlParamName}: {between: {startDate: "${formattedStartDate}", endDate: "${prepareEndDateForBackend(
          dateFilter.endDate
        )}"}}`
      );
    } else {
      gqlFilters.push(`${gqlParamName}: {goe: "${formattedStartDate}"}`);
    }
  }

  function prepareEndDateForBackend(inDate) {
    const dateToEdit = inDate.replace(/\//g, '/');
    const parts = dateToEdit.split(' ');
    let endDate;
    let formatToUse;

    if (parts.length === 2) {
      formatToUse = 'DD/MM/YYYY HH:mm:ss';
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
    if (parts.length === 2) {
      return startDate;
    } else {
      return `${parts[0]} 00:00:00`;
    }
  }
}

export function formatBytes(bytes, decimals = 2) {
  if (bytes === undefined) return '';

  if (bytes === 0) return '0 octet';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const octet = bytes > 1 ? 'octets' : 'octet';
  const sizes = [octet, 'Ko', 'Mo', 'Go', 'To'];

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
      return `${parseInt(days)}j ${parseInt(hours, 10)}h ${min}min ${sec}sec`;
    }
    return `${parseInt(days)}j0${parseInt(hours, 10)}h${min}min${sec}sec`;
  } else if (value < 86400 && value > 3600) {
    if (parseInt(hours, 10) > 0) {
      return `${parseInt(hours, 10)}h ${min}min ${sec}sec`;
    }
    return `0${parseInt(hours, 10)}h ${min}min ${sec}sec`;
  } else if (value === 0) {
    return `0`;
  } else {
    return `${min}min ${sec}sec`;
  }
}
// temporaire, en attendant une mise en conformité de la demande pour tous les graphes
export function resumeAndTruncateFormattedValueFromSeconds(value) {
  if (value === undefined) return '';

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
      return `${parseInt(days)}j`;
    }
    return `${parseInt(days)}j0${parseInt(hours, 10)}h${min}min${sec}sec`;
  } else if (value < 86400 && value > 3600) {
    if (parseInt(hours, 10) > 0) {
      return `${parseInt(hours, 10)}h`;
    }
    return `0${parseInt(hours, 10)}h`;
  } else if (value === 0) {
    return `0`;
  } else {
    return `${min}min`;
  }
}

export function formatToM(num) {
  return Math.abs(num) > 999999
    ? Math.sign(num) * (Math.abs(num) / 1000000).toFixed(2) + 'M'
    : Math.sign(num) * Math.abs(num);
}

export function fromHoursToDDHH(value) {
  let initialSeconds = value * 60 * 60;
  let duration = initialSeconds;
  let days = duration / 86400;
  duration = duration % 86400;
  let hours = parseInt(duration / 3600);

  if (initialSeconds > 86400) {
    if (hours > 9) {
      return `${parseInt(days)}j ${parseInt(hours, 10)}h`;
    }
    return `${parseInt(days)}j 0${parseInt(hours, 10)}h`;
  } else if (initialSeconds < 86400 && initialSeconds > 3600) {
    if (parseInt(hours, 10) > 0) {
      return `${parseInt(hours, 10)}h`;
    }
    return `0${parseInt(hours, 10)}h`;
  } else if (initialSeconds === 0) {
    return 0;
  } else {
    return '';
  }
}

export function formattedEnum24H(value) {
  const formattedValue = value / 3600;
  return formattedValue.toFixed(2) + ' H';
}
