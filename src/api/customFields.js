import { query } from './utils';

export async function fetchCustomFields(partnerId) {
  const queryStr = `
  query{
    party(id: ${partnerId}) {
      custom1FieldType
    	custom1FieldMandatory
      custom1ValidatedValuesAsList
      custom2FieldType
    	custom2FieldMandatory
      custom2ValidatedValuesAsList
      custom3FieldType
    	custom3FieldMandatory
      custom3ValidatedValuesAsList
      custom4FieldType
    	custom4FieldMandatory
      custom4ValidatedValuesAsList
      custom5FieldType
    	custom5FieldMandatory
      custom5ValidatedValuesAsList
      custom6FieldType
    	custom6FieldMandatory
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
      mandatory: response.data.party.custom1FieldMandatory,
    },
    {
      id: partnerId + 'customField2',
      code: 'customField2',
      type: response.data.party.custom2FieldType,
      value: response.data.party.custom2ValidatedValuesAsList,
      mandatory: response.data.party.custom2FieldMandatory,
    },
    {
      id: partnerId + 'customField3',
      code: 'customField3',
      type: response.data.party.custom3FieldType,
      value: response.data.party.custom3ValidatedValuesAsList,
      mandatory: response.data.party.custom3FieldMandatory,
    },
    {
      id: partnerId + 'customField4',
      code: 'customField4',
      type: response.data.party.custom4FieldType,
      value: response.data.party.custom4ValidatedValuesAsList,
      mandatory: response.data.party.custom4FieldMandatory,
    },
    {
      id: partnerId + 'customField5',
      code: 'customField5',
      type: response.data.party.custom5FieldType,
      value: response.data.party.custom5ValidatedValuesAsList,
      mandatory: response.data.party.custom5FieldMandatory,
    },
    {
      id: partnerId + 'customField6',
      code: 'customField6',
      type: response.data.party.custom6FieldType,
      value: response.data.party.custom6ValidatedValuesAsList,
      mandatory: response.data.party.custom6FieldMandatory,
    },
  ];
}
