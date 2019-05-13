<template>
  <div class="main-content">
    <h3 class="font-weight-light text-center mt-4 mb-4">{{ $t('orders.add-custom-field') }}</h3>
    <p class="subtitle">{{ $t('orders.required-custom-field') }}</p>
    <UiInput class="d-block" placeholder v-model="labelCustomField" value>
      <template slot="beforeInput">{{ $t('orders.input-label-custom-field') }} {{ numberOfustomFields + 1 }} :</template>
    </UiInput>
    <div>
      <label class="standalone">{{ $t('orders.choose-type-custom-field') }} :</label>
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
          <CreateOrderAddCustomList :options.sync="listOptions" />
        </div>
      </div>
    </div>

    <div>
      <label class="standalone mb-2">{{ $t('orders.new.settingsStep.mandatoryField') }} :</label>

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
    <div class="row mt-4">
      <div class="col">
        <UiButton @click="$emit('cancel')" variant="outline-primary" class="float-left">
          {{ $t('cancel') }}
        </UiButton>
      </div>
      <div class="col">
        <UiButton
          :variant="canAddCustomField() ? 'primary' : 'outline-simple'"
          class="float-right"
          :disabled="!canAddCustomField()"
          @click="saveCustomField"
        >
          {{ $t('orders.add-custom-field') }}
        </UiButton>
      </div>
    </div>
  </div>
</template>

<script>
import UiInput from '@/components/ui/UiInput';
import UiButton from '@/components/ui/Button';
import UiCheckbox from '@/components/ui/Checkbox';

import CreateOrderAddCustomList from './CreateOrderAddCustomList';

export default {
  name: 'CreateOrderAddCustomField',

  data() {
    return {
      customFieldType: 'TEXT', // possible values: text, list, date
      labelCustomField: null,
      listOptions: [],
      selectedMandatoryValue: undefined,
    };
  },

  props: {
    numberOfustomFields: Number,
  },

  watch: {
    customFieldType: () => {
      if (!this) return;
      return this.canAddCustomField();
    },
  },

  methods: {
    saveCustomField() {
      if (!this.selectedMandatoryValue) return;
      const fieldData = {
        label: this.labelCustomField,
        type: this.customFieldType,
        values: this.listOptions,
        mandatoryVal: this.selectedMandatoryValue,
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
  },

  components: {
    UiInput,
    UiButton,
    UiCheckbox,
    CreateOrderAddCustomList,
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
