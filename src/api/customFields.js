import { query } from './utils';

export async function fetchCustomFields(partnerId) {
  const queryStr = `
  query{
    party(id: ${partnerId}) {
      custom1FieldType
      custom1ValidatedValuesAsList
      custom2FieldType
      custom2ValidatedValuesAsList
      custom3FieldType
      custom3ValidatedValuesAsList
      custom4FieldType
      custom4ValidatedValuesAsList
      custom5FieldType
      custom5ValidatedValuesAsList
      custom6FieldType
      custom6ValidatedValuesAsList
    }
  }
  `;
  const response = await query(queryStr);

  return [
    {
      id: partnerId + 'customField1',
      code: 'customField1',
      type: response.data.party.custom1FieldType,
      value: response.data.party.custom1ValidatedValuesAsList,
    },
    {
      id: partnerId + 'customField2',
      code: 'customField2',
      type: response.data.party.custom2FieldType,
      value: response.data.party.custom2ValidatedValuesAsList,
    },
    {
      id: partnerId + 'customField3',
      code: 'customField3',
      type: response.data.party.custom3FieldType,
      value: response.data.party.custom3ValidatedValuesAsList,
    },
    {
      id: partnerId + 'customField4',
      code: 'customField4',
      type: response.data.party.custom4FieldType,
      value: response.data.party.custom4ValidatedValuesAsList,
    },
    {
      id: partnerId + 'customField5',
      code: 'customField5',
      type: response.data.party.custom5FieldType,
      value: response.data.party.custom5ValidatedValuesAsList,
    },
    {
      id: partnerId + 'customField6',
      code: 'customField6',
      type: response.data.party.custom6FieldType,
      value: response.data.party.custom6ValidatedValuesAsList,
    },
  ];
}
