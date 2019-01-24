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
      label: 'Champ libre 1',
      id: partnerId + 'custom1Field',
      type: response.data.party.custom1FieldType,
      value: response.data.party.custom1ValidatedValuesAsList,
    },
    {
      label: 'Champ libre 2',
      id: partnerId + 'custom2Field',
      type: response.data.party.custom2FieldType,
      value: response.data.party.custom2ValidatedValuesAsList,
    },
    {
      label: 'Champ libre 3',
      id: partnerId + 'custom3Field',
      type: response.data.party.custom3FieldType,
      value: response.data.party.custom3ValidatedValuesAsList,
    },
    {
      label: 'Champ libre 4',
      id: partnerId + 'custom4Field',
      type: response.data.party.custom4FieldType,
      value: response.data.party.custom4ValidatedValuesAsList,
    },
    {
      label: 'Champ libre 5',
      id: partnerId + 'custom5Field',
      type: response.data.party.custom5FieldType,
      value: response.data.party.custom5ValidatedValuesAsList,
    },
    {
      label: 'Champ libre 6',
      id: partnerId + 'custom6Field',
      type: response.data.party.custom6FieldType,
      value: response.data.party.custom6ValidatedValuesAsList,
    },
  ];
}
