<template>
  <div class="step-settings-container">
    <div class="panel-vertical-container" v-if="!isOpen">
      <div class="main-content">
        <CreateOrderAddOrderReference
          :value="referenceValue"
          @input="onReferenceSet"
          :check-for-error="orderReferenceError"
        />
        <h3 class="font-weight-light text-center mt-4 mb-4">
          {{ $t('orders.choose-custom-field') }}
        </h3>
        <div class="subcontainer">
          <div>
            <CustomFields
              :fields="allCustomFields"
              :get-selected-value="getSelectedValue"
              :errors="customFieldsErrors"
              @change="onValueChanged"
            />
          </div>
          <UiButton
            v-if="allCustomFields.length < MAX_ALLOWED_CUSTOM_FIELDS"
            variant="adder"
            block
            class
            @click="open"
          >
            <i class="btn-round-button ic-Plus-Icon mr-2" />
            {{ $t('orders.add-custom-field') }}
          </UiButton>
        </div>
      </div>
      <div class="footer-back">
        <div class="row">
          <div class="col-md-12 mb-5">
            <UiButton
              variant="round-button"
              @click="$emit('prev')"
              class="float-left ic-Arrow-Previous-Icon"
            />
          </div>
        </div>
      </div>
    </div>
    <div v-if="isOpen">
      <CreateOrderAddCustomField @cancel="close" @add-field="onSaveField" />
    </div>
  </div>
</template>

<script>
import CreateOrderAddOrderReference from './CreateOrderAddOrderReference';
import CreateOrderAddCustomField from './CreateOrderAddCustomField';
import CustomFields from '@/components/CustomFields';
import UiButton from '@/components/ui/Button';
import { fetchCustomFields, createCustomField } from '@/api/customFields';
import get from 'lodash.get';

export default {
  data() {
    return {
      isOpen: false,
      allCustomFields: [],
      customFieldsValues: [],
      referenceValue: '',
      MAX_ALLOWED_CUSTOM_FIELDS: 6,
    };
  },

  props: {
    synthesis: {
      type: Object,
      required: true,
    },
    customFieldsErrors: Array,
    orderReferenceError: String,
    order: Object,
  },

  async mounted() {
    await this.fetchCustomFieldsForPartner();
    this.preFill();
  },

  methods: {
    open() {
      this.isOpen = true;
    },
    close() {
      this.isOpen = false;
    },

    preFill() {
      if (!this.synthesis.customFields && this.order) {
        for (let i = 1, max = this.allCustomFields.length; i <= max; i++) {
          const value = this.order.customFields['custom' + i];
          if (value) {
            this.onValueChanged(this.allCustomFields[i - 1], value);
          }
        }
      }
    },

    async fetchCustomFieldsForPartner() {
      const partnerId = this.synthesis.billingAccount.value.partnerId;
      const isActivationAsked = get(this.synthesis, 'services.selection.activation', false);

      const allCustomFields = await fetchCustomFields(partnerId);
      this.allCustomFields = allCustomFields.map(c => {
        c.isOptional = true;
        if (c.mandatory === 'ORDER') {
          c.isOptional = false;
        } else if (isActivationAsked && c.mandatory === 'ACTIVATION') {
          c.isOptional = false;
        }
        return c;
      });
      this.$emit('customFieldsMeta', {
        all: this.allCustomFields,
        values: [],
      });
    },

    async onSaveField(fieldData) {
      this.isOpen = false;

      await createCustomField({
        partyId: get(this.synthesis, 'billingAccount.selection.partner.id'),
        label: fieldData.label,
        type: fieldData.type,
        values: fieldData.values,
        mandatoryVal: fieldData.mandatoryVal,
      });

      this.fetchCustomFieldsForPartner();
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

      this.$emit('customFieldsMeta', {
        all: this.allCustomFields,
        values: this.customFieldsValues,
      });

      this.done();
    },

    done() {
      this.$emit('done', this.assembleSynthesis());
    },
    prev() {
      this.$emit('prev', this.assembleSynthesis());
    },

    assembleSynthesis() {
      const customFieldsSynthesis = this.customFieldsValues
        .map(c => {
          if (!c.enteredValue && !c.enteredValue.length) return;
          return `${c.label} : ${c.enteredValue}`;
        })
        .filter(c => c !== undefined);

      const synthesis = {};
      if (this.referenceValue && this.referenceValue.length > 0) {
        synthesis.orderReference = {
          label: 'common.orderReference',
          value: {
            id: 'orderReference',
            content: this.referenceValue,
          },
          selection: {
            orderReference: this.referenceValue,
          },
        };
      } else {
        synthesis.orderReference = undefined;
      }

      if (
        this.customFieldsValues &&
        this.customFieldsValues.length &&
        customFieldsSynthesis.length
      ) {
        const selection = this.customFieldsValues
          .map(c => {
            if (!c.enteredValue && !c.enteredValue.length) return;
            return {
              code: c.code,
              value: c.enteredValue,
              mandatory: c.mandatory,
            };
          })
          .filter(c => c !== undefined);

        synthesis.customFields = {
          label: 'common.customFields',
          value: {
            id: 'customFields',
            content: customFieldsSynthesis,
          },
          selection,
        };
      } else {
        synthesis.customFields = undefined;
      }
      return synthesis;
    },

    onReferenceSet(value) {
      this.referenceValue = value;
      this.done();
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
  padding: 0 2rem;

  @media screen and (min-width: 1440px) {
    padding: 0 7rem;
  }
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
    max-height: 21rem;
    overflow-y: auto;
  }
}
@media screen and (min-height: 769px) {
  .subcontainer {
    max-height: 31rem;
    overflow-y: auto;
  }
}

@media screen and (max-height: 768px) {
  .panel-vertical-container {
    div.step-content {
      max-height: 75vh;
      min-height: 75vh !important;
    }
  }
}
@media screen and (min-height: 769px) {
  .panel-vertical-container {
    div.step-content {
      min-height: 75vh;
      max-height: 87vh;
    }
  }
}
</style>
