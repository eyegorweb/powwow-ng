<template>
  <div class="step-settings-container">
    <div class="panel-vertical-container" v-if="!isOpen">
      <div class="main-content">
        <CreateOrderAddOrderReference :value="referenceValue" @input="onReferenceSet" />
        <h3 class="font-weight-light text-center mt-4 mb-4">{{ $t('orders.choose-custom-field') }}</h3>
        <div class="subcontainer">
          <div>
            <CustomFields
              :fields="allCustomFields"
              :get-selected-value="getSelectedValue"
              @change="onValueChanged"
            />
          </div>
          <UiButton v-if="allCustomFields.length < MAX_ALLOWED_CUSTOM_FIELDS" variant="adder" block class @click="open">
            <i class="btn-round-button ic-Plus-Icon mr-2" />
            {{ $t("orders.add-custom-field") }}
          </UiButton>
        </div>
      </div>
      <div class="footer-bock">
        <div class="row">
          <div class="col-md-12 mt-5">
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

    async onSaveField(fieldData) {
      this.isOpen = false;

      await createCustomField({
        partyId: get(this.synthesis, 'billingAccount.selection.partner.id'),
        label: fieldData.label,
        type: fieldData.type,
        values: fieldData.values,
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
    },

    done() {
      this.$emit('done', this.assembleSynthesis());
    },
    prev() {
      this.$emit('prev', this.assembleSynthesis());
    },

    assembleSynthesis() {
      return {
        orderReference: {
          label: 'common.orderReference',
          value: {
            id: 'orderReference',
            content: this.referenceValue,
          },
        },
      };
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
</style>
