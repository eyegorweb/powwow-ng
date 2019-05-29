import axios from 'axios';
import moment from 'moment';

// import store from '@/store';

export const api = axios.create();

/**
 *  Besoin de gérer les erreurs
 */
export async function query(q) {
  try {
    const response = await api.post(process.env.VUE_APP_GQL_SERVER_URL, { query: q });
    return response.data;
  } catch (e) {
    // TODO: COrrectly test this
    // store.commit('startRefreshingToken');
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

  function formatDateForGql(inDate) {
    if (!inDate) return '';
    const startDate = inDate.replace(/\//g, '-');
    const parts = startDate.split(' ');
    if (parts) {
      if (parts.length === 2) {
        return startDate;
      } else {
        return `${parts[0]} 00:00:00`;
      }
    }
  }

  function prepareEndDateForBackend(inDate) {
    const dateToEdit = inDate.replace(/\//g, '-');
    const parts = dateToEdit.split(' ');
    let endDate;
    let formatToUse;

    if (parts.length === 2) {
      formatToUse = 'DD-MM-YYYY hh:mm:ss';
      endDate = moment(dateToEdit, formatToUse);
      if (!dateFilter.sameDay) {
        endDate = endDate.add(1, 'days');
      }
      return endDate.format(formatToUse);
    } else {
      formatToUse = 'DD-MM-YYYY';
      endDate = moment(`${parts[0]}`, formatToUse);
      if (!dateFilter.sameDay) {
        endDate = endDate.add(1, 'days');
      }
      return endDate.format(formatToUse) + ' 00:00:00';
    }
  }
}
