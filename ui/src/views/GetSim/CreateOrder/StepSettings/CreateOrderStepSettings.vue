<template>
  <CreateOrderStepContainer @done="done" @prev="prev" no-next-button :no-buttons="isOpen">
    <template v-if="!isOpen">
      <div class="main-content2">
        <template v-if="!userIsMVNO">
          <h3 class="font-weight-light text-center mt-4 mb-4">
            {{ $t('orders.choose-delivery-notification') }}
          </h3>
          <div class="toggles-container">
            <UiToggle
              :label="$t('orders.by-sms')"
              v-model="smsNotification"
              :editable="canEditSmsNofication"
            />
            <UiToggle
              :label="$t('orders.by-mail')"
              v-model="emailNotification"
              :editable="canEditEmailNofication"
            />
          </div>
        </template>
        <CreateOrderAddOrderReference
          :value="referenceValue"
          @input="onReferenceSet"
          :check-for-error="orderReferenceError"
          :is-order-number-mandatory="isOrderNumberMandatory"
        />
        <template v-if="!userIsMVNO">
          <h3 class="font-weight-light text-center mt-4 mb-4">
            {{ $t('orders.choose-custom-field') }}
          </h3>
          <div class="subcontainer">
            <div>
              <PartnerFields
                :custom-fields="allCustomFields"
                :get-selected-value="getSelectedValue"
                :errors="customFieldsErrors"
                date-picker-direction="auto"
                can-edit-list
                show-optional-field
                empty-dates
                @change="onValueChanged"
                @addValueToList="addValueToList"
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
              {{ $t('orders.add-custom-field-action', { label }) }}
            </UiButton>
          </div>
        </template>
      </div>
    </template>
    <template v-if="isOpen">
      <AddCustomField
        :panel="panel"
        :label-title="label"
        :fixheight="false"
        :number-of-custom-fields="allCustomFields.length"
        :close="close"
        @add-field="onSaveField"
      />
    </template>
  </CreateOrderStepContainer>
</template>

<script>
import CreateOrderAddOrderReference from './CreateOrderAddOrderReference';
import AddCustomField from './AddCustomField';
import PartnerFields from '@/components/PartnerFields';
import UiButton from '@/components/ui/Button';
import { fetchCustomFields, createCustomField, addItemToCustomFieldList } from '@/api/customFields';
import get from 'lodash.get';
import { mapMutations, mapGetters } from 'vuex';
import CreateOrderStepContainer from '../CreateOrderStepContainer';
import UiToggle from '@/components/ui/UiToggle';

export default {
  components: {
    CreateOrderAddOrderReference,
    AddCustomField,
    UiButton,
    PartnerFields,
    CreateOrderStepContainer,
    UiToggle,
  },

  data() {
    return {
      isOpen: false,
      allCustomFields: [],
      customFieldsValues: [],
      referenceValue: '',
      MAX_ALLOWED_CUSTOM_FIELDS: 6,
      isOrderNumberMandatory: false,
      panel: 'order',
      label: 'libre',
      smsNotification: false,
      emailNotification: false,
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
    this.isOrderNumberMandatory = get(
      this.synthesis,
      'billingAccount.selection.partner.options.orderNumberRequired',
      false
    );
  },

  computed: {
    ...mapGetters('getsim', ['selectedPartnersValues']),
    ...mapGetters(['userIsMVNO']),
    canEditSmsNofication() {
      if (!this.isNotValidPhoneNumber) return false;
      return true;
    },
    canEditEmailNofication() {
      if (get(this.synthesis, 'delivery.value.detail.contactInformation.email')) return true;
      return false;
    },
    isNotValidPhoneNumber() {
      const exlcudedPrefixNumbers = [
        '01',
        '02',
        '03',
        '04',
        '05',
        '09',
        '331',
        '332',
        '333',
        '334',
        '335',
        '339',
        '00331',
        '00332',
        '00333',
        '00334',
        '00335',
        '00339',
        '+331',
        '+332',
        '+333',
        '+334',
        '+335',
        '+339',
      ];
      const phoneValue = get(this.synthesis, 'delivery.value.detail.contactInformation.phone');
      if (exlcudedPrefixNumbers.filter((p) => phoneValue.indexOf(p) === 0).length > 0) {
        return true;
      }
      return false;
    },
  },

  methods: {
    ...mapMutations('getsim', ['setFilterCustomFieldsList']),
    open() {
      this.isOpen = true;
    },
    close() {
      this.isOpen = false;
    },

    async addValueToList(newListItem, customField) {
      const partnerId = get(this.synthesis, 'billingAccount.value.partnerId');
      if (!partnerId) return;

      await addItemToCustomFieldList(partnerId, newListItem, customField.code);
      this.fetchCustomFieldsForPartner();
    },

    preFill() {
      this.synthesis.smsNotification = this.smsNotification;
      this.synthesis.emailNotification = this.emailNotification;

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
      this.refreshCustomFieldsInFilterBar(allCustomFields.customFields);
      this.allCustomFields = allCustomFields.customFields.map((c) => {
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

    refreshCustomFieldsInFilterBar(allCustomFields) {
      const partnersInFilterBar = this.selectedPartnersValues;
      if (partnersInFilterBar && partnersInFilterBar.length === 1) {
        const selectedPartnerId = this.synthesis.billingAccount.value.partnerId;
        const partnerIdInFIlter = partnersInFilterBar[0].id;
        if (partnerIdInFIlter === selectedPartnerId) {
          this.setFilterCustomFieldsList(allCustomFields);
        }
      }
    },

    async onSaveField(fieldData) {
      this.isOpen = false;

      await createCustomField({
        partyId: get(this.synthesis, 'billingAccount.selection.partner.id'),
        label: fieldData.label,
        type: fieldData.type,
        values: fieldData.values,
        mandatoryVal: fieldData.mandatoryVal,
        isSpec: false,
      });

      this.fetchCustomFieldsForPartner();
    },
    getSelectedValue(code) {
      const existingFieldValue = this.customFieldsValues.find((c) => c.code === code);
      if (existingFieldValue) {
        return existingFieldValue.enteredValue;
      }
    },
    onValueChanged(customField, enteredValue) {
      const existingFieldValue = this.customFieldsValues.find((c) => c.code === customField.code);
      if (existingFieldValue) {
        this.customFieldsValues = this.customFieldsValues.map((c) => {
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
        .map((c) => {
          if (!c.enteredValue && !c.enteredValue.length) return;
          return `${c.label} : ${c.enteredValue}`;
        })
        .filter((c) => c !== undefined);

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
          .map((c) => {
            if (!c.enteredValue && !c.enteredValue.length) return;
            return {
              code: c.code,
              value: c.enteredValue,
              mandatory: c.mandatory,
            };
          })
          .filter((c) => c !== undefined);

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

      synthesis.smsNotification = this.smsNotification;
      synthesis.emailNotification = this.emailNotification;

      return synthesis;
    },

    onReferenceSet(value) {
      this.referenceValue = value;
      this.done();
    },
  },

  watch: {
    smsNotification(newValue) {
      if (newValue) this.done();
    },
    emailNotification(newValue) {
      if (newValue) this.done();
    },
  },
};
</script>

<style lang="scss" scoped>
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

.prev-btn {
  position: absolute;
  left: 1rem;
  bottom: 0;
}

.subcontainer {
  max-height: 24rem;
  overflow-y: auto;
}

.toggles-container {
  flex-grow: 1;
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;

  .toggle {
    flex: 1 100%;
    flex-grow: 1;
    padding-right: 5px;
  }
}
</style>
