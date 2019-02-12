<template>
  <div class="step-settings-container">
    <div v-if="!isOpen">
      <CreateOrderAddOrderReference :value="referenceValue" @input="(newValue) => { referenceValue = newValue }"  />

      <h2 class="title">{{ $t('orders.choose-custom-field') }}</h2>

      <div class="subcontainer">
        <div>
          <CustomFields
            :fields="allCustomFields"
            :get-selected-value="getSelectedValue"
            @change="onValueChanged"
          />
        </div>
        <UiButton variant="adder" block class @click="open">
          <i class="btn-round-button ic-Plus-Icon mr-2" />
          {{ $t("orders.add-custom-field") }}
        </UiButton>
      </div>
    </div>

    <div v-if="isOpen">
      <CreateOrderAddCustomField @cancel="close" @add-field="onSaveField" />
    </div>

    <div class="row" v-if="!isOpen">
      <div class="col-md-12 mt-5">
        <UiButton
          variant="round-button"
          @click="$emit('prev')"
          class="float-left ic-Arrow-Previous-Icon"
        />
        <UiButton
          variant="round-button"
          @click="$emit('done')"
          class="float-right ic-Arrow-Next-Icon"
        />
      </div>
    </div>
  </div>
</template>

<script>
import CreateOrderAddOrderReference from './CreateOrderAddOrderReference';
import CreateOrderAddCustomField from './CreateOrderAddCustomField';
import CustomFields from '@/components/CustomFields';
import UiButton from '@/components/ui/Button';
import { fetchCustomFields } from '@/api/customFields';

export default {
  data() {
    return {
      isOpen: false,
      allCustomFields: [],
      customFieldsValues: [],
      referenceValue: '',
    };
  },

  props: {
    synthesis: {
      type: Object,
      required: true,
    },
  },

  created() {
    this.fetchCustomFieldsForPartner();
  },

  methods: {
    open() {
      this.isOpen = true;
    },
    close() {
      this.isOpen = false;
    },

    async fetchCustomFieldsForPartner() {
      const partnerId = this.synthesis.billingAccount.value.partnerId;
      this.allCustomFields = await fetchCustomFields(partnerId);
    },

    onSaveField(fieldData) {
      this.isOpen = false;

      // Code jetable en attendant le backend
      this.allCustomFields = [
        ...this.allCustomFields,
        {
          code: fieldData.label,
          type: fieldData.type,
          value: fieldData.values,
        },
      ];
    },
    getSelectedValue(code) {
      const existingFieldValue = this.customFieldsValues.find(c => c.code === code);
      if (existingFieldValue) {
        return existingFieldValue.enteredValue;
      }
    },
    onValueChanged(customField, enteredValue) {
      const existingFieldValue = this.customFieldsValues.find(c => c.code === customField.code);
      if (existingFieldValue) {
        this.customFieldsValues = this.customFieldsValues.map(c => {
          if (c.code === customField.code) {
            return {
              ...c,
              enteredValue,
            };
          }
          return c;
        });
      } else {
        customField.enteredValue = enteredValue;
        this.customFieldsValues = [...this.customFieldsValues, { ...customField }];
      }
    },
  },

  components: {
    CreateOrderAddOrderReference,
    CreateOrderAddCustomField,
    UiButton,
    CustomFields,
  },
};
</script>

<style lang="scss" scoped>
.step-settings-container {
  font-size: 0.875rem;
  padding: 0 2rem !important;
  .btn-adder {
    color: $dark-gray !important;
    background-color: $light-gray !important;
    border-color: $medium-gray !important;
    .btn-round-button {
      display: inline-block;
      width: 3rem;
      height: 3rem;
      border-radius: 50%;
      border: none;
      font-size: 1.5rem;
      color: $white;
      text-align: center;
      background: $secondary;
      padding: 0 !important;
      vertical-align: middle;
      line-height: 3rem;
    }
  }
}

.title {
  background-color: transparent;
  color: $dark-gray;
  font-weight: 300;
  font-size: 2rem;
  margin: 3rem 0 1.875rem;
  padding: 0;
  text-align: center;
}

@media screen and (max-height: 768px) {
  .subcontainer {
    max-height: 12rem;
    overflow-y: scroll;
  }
}
@media screen and (min-height: 769px) {
  .subcontainer {
    max-height: 27rem;
    overflow-y: scroll;
  }
}
</style>
