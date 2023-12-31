<template>
  <CreateOrderStepContainer @done="done" @prev="prev" no-next-button :no-buttons="isOpen">
    <template v-if="!isOpen">
      <div class="main-content2">
        <template v-if="!isPartnerMVNO">
          <h3 class="font-weight-light text-center mt-4 mb-4">
            {{ $t('orders.choose-chronopost-tracking') }}
          </h3>
          <div class="toggles-container">
            <UiToggle :label="$t('orders.by-mail')" v-model="emailNotifAsked" />
          </div>
          <template v-if="emailNotifAsked">
            <div class="form-entry">
              <FormControl
                label="common.email"
                v-model="emailNotif"
                :max-size="50"
                :class="{ error: emailError }"
                :required="true"
              />
              <span v-if="emailNotif && !isEmailValid(emailNotif)" class="error-text">
                {{ $t('errors.password.email-error') }}
              </span>
            </div>
          </template>
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
              v-if="allCustomFields.length < MAX_ALLOWED_CUSTOM_FIELDS && canUpdate"
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
import { mapMutations, mapGetters } from 'vuex';
import CreateOrderStepContainer from '../CreateOrderStepContainer';
import UiToggle from '@/components/ui/UiToggle';
import FormControl from '@/components/ui/FormControl';

export default {
  components: {
    CreateOrderAddOrderReference,
    AddCustomField,
    UiButton,
    PartnerFields,
    CreateOrderStepContainer,
    UiToggle,
    FormControl,
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
      label: this.$t('free'),
      emailNotifAsked: false,
      emailNotif: undefined,
      emailError: undefined,
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
    this.isOrderNumberMandatory = this.$loGet(
      this.synthesis,
      'billingAccount.selection.partner.options.orderNumberRequired',
      false
    );
  },

  computed: {
    ...mapGetters('getsim', ['selectedPartnersValues']),
    ...mapGetters(['userIsMVNO', 'havePermission']),
    isPartnerMVNO() {
      return (
        this.$loGet(this.synthesis, 'billingAccount.selection.partner.partyType', false) === 'MVNO'
      );
    },
    canUpdate() {
      return this.havePermission('party', 'update_custom_field');
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
      const partnerId = this.$loGet(this.synthesis, 'billingAccount.value.partnerId');
      if (!partnerId) return;

      await addItemToCustomFieldList(partnerId, newListItem, customField.code);
      this.fetchCustomFieldsForPartner();
    },

    preFill() {
      this.synthesis.emailNotif = this.emailNotif;

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
      const isActivationAsked = this.$loGet(this.synthesis, 'services.selection.activation', false);

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
        partyId: this.$loGet(this.synthesis, 'billingAccount.selection.partner.id'),
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
      if (this.emailNotifAsked) {
        this.isEmailValid(this.emailNotif)
          ? this.$emit('validated', true)
          : this.$emit('validated', false);
      } else {
        this.$emit('validated', true);
      }
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
      synthesis.emailNotif = {
        label: 'common.emailNotif',
        value: {
          id: 'emailNotif',
          content: [
            `${this.$t('col.emailNotifAsked')}: ${
              this.emailNotifAsked ? this.$t('common.YES') : this.$t('common.NO')
            }`,
            `${this.$t('col.emailNotif')}:  ${this.emailNotifAsked ? this.emailNotif : ''}`,
          ],
        },
        selection: {
          emailNotif: this.emailNotif,
          emailNotifAsked: this.emailNotifAsked,
        },
      };

      return synthesis;
    },

    onReferenceSet(value) {
      this.referenceValue = value;
      this.done();
    },

    isEmailValid(email) {
      var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    },
  },

  watch: {
    emailNotifAsked(newValue, oldValue) {
      if (newValue != oldValue) this.emailNotif = '';
      this.done();
    },
    emailNotif(newValue, oldValue) {
      if (newValue != oldValue) this.done();
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
