import { query } from './utils';
import get from 'lodash.get';

export async function fetchCustomFields(partnerId) {
  const queryStr = `
  query{
    party(id: ${partnerId}) {
      custom1FieldLabel
      custom1FieldType
    	custom1FieldMandatory
      custom1ValidatedValuesAsList
    	custom2FieldLabel
      custom2FieldType
    	custom2FieldMandatory
      custom2ValidatedValuesAsList
    	custom3FieldLabel
      custom3FieldType
    	custom3FieldMandatory
      custom3ValidatedValuesAsList
    	custom4FieldLabel
      custom4FieldType
    	custom4FieldMandatory
      custom4ValidatedValuesAsList
    	custom5FieldLabel
      custom5FieldType
    	custom5FieldMandatory
      custom5ValidatedValuesAsList
    	custom6FieldLabel
      custom6FieldType
    	custom6FieldMandatory
      custom6ValidatedValuesAsList
    }
  }
  `;
  const response = await query(queryStr);
  const customFields = [];

  for (let i = 1, max = 6; i <= max; i++) {
    addCustomField(response, i);
  }

  function addCustomField(response, index) {
    const label = get(response, `data.party.custom${index}FieldLabel`);
    if (!label) return;

    const data = {
      id: partnerId + 'customField' + index,
      codeInOrder: 'custom' + index,
      code: 'customField' + index,
      label,
      type: get(response, `data.party.custom${index}FieldType`),
      value: get(response, `data.party.custom${index}ValidatedValuesAsList`),
      mandatory: get(response, `data.party.custom${index}FieldMandatory`),
      enteredValue: undefined,
    };
    customFields.push(data);
  }

  return customFields;
}

export async function createCustomField({ partyId, label, type, values, mandatoryVal }) {
  const valuesStr = values.map(v => `"${v}"`).join(',');
  const queryStr = `
  mutation {
    createCustomField(customFieldInput: {
      partyId: ${partyId}
      customFieldLabel: "${label}"
      customFieldType: ${type}
      customFieldListValues: [${valuesStr}]
      customFieldMandatory: ${mandatoryVal}
    }) {
      id
    }
  }
  `;
  const response = await query(queryStr);
  return response.data.createCustomField;
}
