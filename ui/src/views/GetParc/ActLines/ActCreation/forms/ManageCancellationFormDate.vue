<template>
  <div>
    <div class="d-flex align-items-center mb-2">
      <UiDate @change="onDateChange" :value="chosenDate" class="mr-2">
        <i slot="icon" class="select-icon ic-Flag-Icon" />
      </UiDate>
      <UiCheckbox v-model="applyCharges" />
      <span>{{ $t('getparc.actCreation.ManageCancellation.applyCharges') }}</span>
    </div>
    <div class="d-flex validation">
      <button @click="manageRefuse" class="btn btn-cancel pl-4 pr-4 pt-2 pb-2">
        <span>{{ $t('getparc.actCreation.ManageCancellation.refuse') }}</span>
      </button>
      <button
        @click="manageValidation"
        class="btn pl-4 pr-4 pt-2 pb-2"
        :class="{ disabled: !canValidate }"
      >
        <i class="ic-Settings-Icon" />
        <span>{{ $t('getparc.actCreation.ManageCancellation.validate') }}</span>
      </button>
    </div>
  </div>
</template>

<script>
import UiCheckbox from '@/components/ui/Checkbox';
import UiDate from '@/components/ui/UiDate2';

export default {
  components: {
    UiCheckbox,
    UiDate,
  },
  data() {
    return {
      chosenDate: undefined,
      applyCharges: false,
    };
  },
  computed: {
    canValidate() {
      return this.chosenDate ? true : false;
    },
  },
  methods: {
    onDateChange(value) {
      this.chosenDate = value;
    },
    manageRefuse() {
      this.$emit('change:cancel');
    },
    manageValidation() {
      this.$emit('change:validation', {
        applyCharges: this.applyCharges,
        date: this.chosenDate,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/ .datepicker {
  min-width: 255px;
}
/deep/ .checkbox-container label {
  margin-bottom: 0;
}

/deep/ .btn-primary {
  background-color: $orange;
  border: none;
}

.validation {
  .btn {
    background-color: $orange;
    color: white;
    margin-right: 16px;
    margin-left: 0;

    &-cancel {
      color: $primary;
      border: 1px solid $primary;
      background-color: $white;
    }

    &.disabled {
      opacity: 1;
      pointer-events: none;
      background-color: $medium-gray;
    }
  }
}
</style>
