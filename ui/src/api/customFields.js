import { query } from './utils';
import get from 'lodash.get';

export async function updateCustomFieldLabel(partnerId, code, label, type, values, mandatoryVal) {
  const queryStr = `mutation updateCustomField($partnerId: Long!, $label: String!, $code: AvailableCustomFields!, $type: CustomFieldTypeEnum!, $values: [String!], $mandatoryVal: CustomFieldMandatoryEnum) {
    updateCustomField(customFieldInput: {partyId: $partnerId, customFieldLabel: $label, availableCustomFields: $code, fieldTypeEnum: $type, customFieldListValues: $values, customFieldMandatory: $mandatoryVal}) {
      id
    }
  }
  `;

  const response = await query(queryStr, {
    partnerId,
    label,
    code,
    type,
    values,
    mandatoryVal,
  });
  return response.data;
}

export async function deleteCustomField(partnerId, id) {
  const queryStr = `mutation{
    resetCustomField(customFieldInput:{
      partyId:${partnerId}
      availableCustomFields:${id}
    }) {
      id

        custom1FieldType
    custom1FieldLabel
    custom1ValidatedValuesAsList

    custom2FieldType
    custom2FieldLabel
    custom2ValidatedValuesAsList

    custom3FieldType
    custom3FieldLabel
    custom3ValidatedValuesAsList

    custom4FieldType
    custom4FieldLabel
    custom4ValidatedValuesAsList

    custom5FieldType
    custom5FieldLabel
    custom5ValidatedValuesAsList

    custom6FieldType
    custom6FieldLabel
    custom6ValidatedValuesAsList
    }

  }`;

  const response = await query(queryStr);
  return response.data;
}

export async function addItemToCustomFieldList(partyId, newItem, customFieldCode) {
  const queryStr = `
  mutation {
    addElementToCustomFieldOfTypeList(customFieldListElement: "${newItem}", partyId: ${partyId}, customFieldName: ${customFieldCode}) {
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
  return formatCustomFieldsResponse(get(response, 'data.addElementToCustomFieldOfTypeList'));
}

export async function fetchCustomFields(partnerId) {
  const queryStr = `
  query{
    partyCustomFields(partyId: ${partnerId}) {
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
      spec1_label
      speci1FieldType
      speci1FieldMandatory
      speci1ValidatedValuesAsList
      spec2_label
      speci2FieldType
      speci2FieldMandatory
      speci2ValidatedValuesAsList
    }
  }
  `;
  const response = await query(queryStr);
  return formatCustomFieldsResponse(get(response, 'data.partyCustomFields'));
}

function formatCustomFieldsResponse(response) {
  const customFields = [];
  const specificFields = [];

  for (let i = 1, max = 6; i <= max; i++) {
    addCustomField(response, i);
    addSpecField(response, i);
  }

  function addCustomField(response, index) {
    const label = get(response, `custom${index}FieldLabel`);
    if (!label) return;

    const data = {
      id: 'customField' + index,
      codeInOrder: 'custom' + index,
      code: 'custom' + index,
      label,
      type: get(response, `custom${index}FieldType`),
      value: get(response, `custom${index}ValidatedValuesAsList`),
      mandatory: get(response, `custom${index}FieldMandatory`),
      enteredValue: undefined,
    };
    customFields.push(data);
  }
  function addSpecField(response, index) {
    const spec = get(response, `spec${index}_label`);
    if (!spec) return;

    const data = {
      id: 'specField' + index,
      codeInOrder: 'spec' + index,
      code: 'spec' + index,
      spec,
      type: get(response, `speci${index}FieldType`),
      value: get(response, `speci${index}ValidatedValuesAsList`),
      mandatory: get(response, `speci${index}FieldMandatory`),
      enteredValue: undefined,
      isOptional: true,
    };
    specificFields.push(data);
  }

  return { customFields, specificFields };
}

export async function createCustomField({ partyId, label, type, values, mandatoryVal, isSpec }) {
  const valuesStr = values.map((v) => `"${v}"`).join(',');
  const queryStr = `
  mutation {
    createCustomField(customFieldInput: {
      partyId: ${partyId}
      customFieldLabel: "${label}"
      customFieldType: ${type}
      customFieldListValues: [${valuesStr}]
      customFieldMandatory: ${mandatoryVal}
      spec: ${isSpec}
    }) {
      id
    }
  }
  `;
  const response = await query(queryStr);
  return response.data.createCustomField;
}
