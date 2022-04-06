import { query } from './utils';

export async function createHomeMessage(params) {
  const queryStr = `
  mutation CreateHomeMessage($params: HomeMessageInput){
    createHomeMessage(homeMessageInput: $params){
      id
      locale
      type
      messageDate
      message
    }
  }`;

  const response = await query(queryStr, { params });

  return response.data.createHomeMessage;
}

export async function fetchEventMessages() {
  const queryStr = `
  query {
    homeMessages {
      id
      locale
      type
      messageDate
      message
      partyId
      level
    }
  }`;

  const response = await query(queryStr);

  return response.data.homeMessages;
}

export async function deleteEventMessage(id) {
  const queryStr = `
  mutation{
    deleteHomeMessage(homeMessageId: ${id})
  }`;

  const response = await query(queryStr);
  return response.data.deleteHomeMessage;
}
