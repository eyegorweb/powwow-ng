<template>
  <BaseDetailPanelContent white :main="!fixheight">
    <div class="m-3">
      <div v-if="panel === 'order'">
        <h3 class="font-weight-light text-center mt-4 mb-4">
          {{ $t('orders.add-custom-field-action', { label: labelTitle }) }}
        </h3>
        <p class="subtitle">{{ $t('orders.required-custom-field') }}</p>
      </div>
      <UiInput class="d-block" placeholder v-model="labelCustomField" value>
        <template slot="beforeInput">
          {{ $t('orders.input-label-custom-field', { label: labelTitle }) }}
          {{ numberOfCustomFields ? numberOfCustomFields + 1 : '' }} :
        </template>
      </UiInput>
      <div>
        <label class="standalone"
          >{{ $t('orders.choose-type-custom-field', { label: labelTitle }) }} :</label
        >
        <!-- TODO extraire le btn-group dans un composant avec des slots -->
        <div class="buttons-group-container mt-1">
          <div class="btn-group w-100" role="group">
            <button
              type="button"
              class="btn float-left"
              :class="{
                'btn-primary': customFieldType === 'TEXT',
                ' btn-outline-simple': customFieldType !== 'TEXT',
              }"
              @click="customFieldType = 'TEXT'"
            >
              {{ $t('text') }}
            </button>
            <button
              type="button"
              class="btn float-left"
              :class="{
                'btn-primary': customFieldType === 'LIST',
                ' btn-outline-simple': customFieldType !== 'LIST',
              }"
              @click="customFieldType = 'LIST'"
            >
              {{ $t('list') }}
            </button>
            <button
              type="button"
              class="btn float-left"
              :class="{
                'btn-primary': customFieldType === 'DATE',
                ' btn-outline-simple': customFieldType !== 'DATE',
              }"
              @click="customFieldType = 'DATE'"
            >
              {{ $t('date') }}
            </button>
          </div>
        </div>
        <div>
          <div v-if="customFieldType === 'LIST'">
            <CreateOrderAddCustomList :options.sync="listOptions" is-open />
          </div>
        </div>
      </div>

      <div>
        <label class="standalone mb-2"
          >{{ $t('orders.mandatory-custom-field', { label: labelTitle }) }} :</label
        >

        <div class="row mb-2">
          <div class="col">
            <UiCheckbox
              class="float-left"
              input-type="radio"
              shape="round"
              name="orderRequired"
              v-model="selectedMandatoryValue"
              value="NONE"
            />
            <div class="float-left">{{ $t('orders.new.settingsStep.NONE') }}</div>
          </div>

          <div class="col">
            <UiCheckbox
              class="float-left"
              input-type="radio"
              shape="round"
              name="orderRequired"
              v-model="selectedMandatoryValue"
              value="ORDER"
            />
            <div class="float-left">{{ $t('orders.new.settingsStep.ORDER') }}</div>
          </div>
        </div>

        <div class="row">
          <div class="col">
            <UiCheckbox
              class="float-left"
              input-type="radio"
              shape="round"
              name="orderRequired"
              v-model="selectedMandatoryValue"
              value="ACTIVATION"
            />
            <div class="float-left">{{ $t('orders.new.settingsStep.ACTIVATION') }}</div>
          </div>

          <div class="col">
            <UiCheckbox
              class="float-left"
              input-type="radio"
              shape="round"
              name="orderRequired"
              v-model="selectedMandatoryValue"
              value="PAIRING"
            />
            <div class="float-left">{{ $t('orders.new.settingsStep.PAIRING') }}</div>
          </div>
        </div>
      </div>
    </div>

    <AddCustomFieldActions
      slot="footer"
      class="action-buttons"
      @cancel="close"
      @add-field="saveCustomField"
      :can-send="canAddCustomField()"
      :text="actionLabel"
    />
  </BaseDetailPanelContent>
</template>

<script>
import BaseDetailPanelContent from '@/components/BaseDetailPanelContent';
import UiInput from '@/components/ui/UiInput';
import UiCheckbox from '@/components/ui/Checkbox';
import AddCustomFieldActions from './AddCustomFieldActions';

import CreateOrderAddCustomList from './CreateOrderAddCustomList';

export default {
  name: 'AddCustomField',

  components: {
    BaseDetailPanelContent,
    UiInput,
    UiCheckbox,
    CreateOrderAddCustomList,
    AddCustomFieldActions,
  },

  data() {
    return {
      customFieldType: 'TEXT',
      labelCustomField: null,
      listOptions: [],
      selectedMandatoryValue: undefined,
      changeLabelOnly: false,
    };
  },

  props: {
    numberOfCustomFields: Number,
    close: Function,
    fixheight: Boolean,
    panel: String,
    labelTitle: String,
    isUpdating: Boolean,
    prefilledValues: {
      type: Object,
      required: false,
    },
  },

  watch: {
    customFieldType() {
      if (!this) return;
      return this.canAddCustomField();
    },
  },

  mounted() {
    if (this.prefilledValues) {
      this.prefillValues();
    }
  },

  methods: {
    prefillValues() {
      this.changeLabelOnly = true;
      this.customFieldType = this.prefilledValues.type;
      if (this.prefilledValues.label) {
        this.labelCustomField = this.prefilledValues.label;
      }

      if (this.prefilledValues.listOptions) {
        this.listOptions = this.prefilledValues.listOptions;
      }

      if (this.prefilledValues.mandatory) {
        this.selectedMandatoryValue = this.prefilledValues.mandatory;
      }
    },
    saveCustomField() {
      if (!this.selectedMandatoryValue) return;
      const fieldData = {
        label: this.labelCustomField,
        type: this.customFieldType,
        values: this.listOptions,
        mandatoryVal: this.selectedMandatoryValue,
        isSpec: false,
      };
      this.$emit('add-field', fieldData);
    },
    canAddCustomField() {
      if (this.customFieldType === 'LIST') {
        return (
          !!this.labelCustomField && !!this.listOptions.length && !!this.selectedMandatoryValue
        );
      }
      return !!this.labelCustomField && !!this.selectedMandatoryValue;
    },
  },

  computed: {
    getAllInput() {
      return this.allInput;
    },
    actionLabel() {
      if (this.isUpdating) {
        return this.$t('orders.update-custom-field-action');
      }
      return this.$t('orders.add-custom-field-action', { label: this.labelTitle });
    },
  },
};
</script>

<style lang="scss" scoped>
.title {
  background-color: transparent;
  color: $dark-gray;
  font-weight: 300;
  font-size: 2rem;
  margin: 3rem 0 1.875rem;
  padding: 0;
  text-align: center;
}

label {
  font-weight: 600;
  font-size: 0.875rem;
  margin-bottom: 2rem;
  &.standalone {
    margin-bottom: 2px;
  }
}
.subtitle {
  color: $gray-680;
  font-size: 0.875rem;
  line-height: 1.5rem;
  text-align: center;
}
.show-all-types {
  color: $secondary;
  font-weight: 600;
  font-size: 0.9rem;
  appearance: none;
  padding: 0;
  margin: 0;
  border: none;
  background-color: transparent;

  &:hover {
    text-decoration: none;
  }

  i {
    font-size: 1rem;
  }
}
.tabs {
  .tabs-bar::after {
    display: none !important;
  }
}

.buttons-group-container {
  display: flex;
  justify-content: center;

  .btn {
    padding: 0.6rem 2rem;
    width: 33.33%;
  }
}
</style>
