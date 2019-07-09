<template>
  <div>
    <p class="mb-0 font-weight-bold">
      {{ $t('getparc.actCreation.ManageCancellation.chooseADelay') }}:
    </p>
    <div class="delay-container">
      <UiSelect
        class="text-gray"
        v-model="selectedDelay"
        :placeholder="$t('getparc.actCreation.ManageCancellation.choose')"
        :options="delays"
      >
      </UiSelect>
      <!-- <UiCheckbox v-model="applyCharges" />
      <span>{{ $t('getparc.actCreation.ManageCancellation.applyCharges') }}</span> -->
    </div>
    <div class="d-flex">
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
// import UiCheckbox from '@/components/ui/Checkbox';
import UiSelect from '@/components/ui/UiSelect';

import moment from 'moment';

export default {
  components: {
    // UiCheckbox,
    UiSelect,
  },
  data() {
    return {
      selectedDelay: null,
      delays: [
        {
          id: 'now',
          value: '0',
          label: this.$t('getparc.actCreation.ManageCancellation.delays.0'),
        },
        {
          id: '1',
          value: '1',
          label: this.$t('getparc.actCreation.ManageCancellation.delays.1'),
        },
        {
          id: '2',
          value: '2',
          label: this.$t('getparc.actCreation.ManageCancellation.delays.2'),
        },
        {
          id: '3',
          value: '3',
          label: this.$t('getparc.actCreation.ManageCancellation.delays.3'),
        },
        {
          id: '4',
          value: '4',
          label: this.$t('getparc.actCreation.ManageCancellation.delays.4'),
        },
        {
          id: '5',
          value: '5',
          label: this.$t('getparc.actCreation.ManageCancellation.delays.5'),
        },
      ],
      // applyCharges: false,
    };
  },
  methods: {
    manageRefuse() {
      this.$emit('change:cancel');
    },
    manageValidation() {
      this.$emit('change:validation', {
        // applyCharges: this.applyCharges,
        convertedDelay: this.convertedDelay,
      });
    },
  },
  computed: {
    canValidate() {
      return this.selectedDelay !== null ? true : false;
    },
    convertedDelay() {
      let delayObject = {
        months: this.selectedDelay,
        startDate: moment().format('MM-DD-YYYY'),
        endDate: moment()
          .add(this.selectedDelay, 'months')
          .format('MM-DD-YYYY'),
      };
      return this.selectedDelay ? delayObject : undefined;
    },
  },
};
</script>

<style lang="scss" scoped>
.delay-container {
  margin-bottom: 1rem;
  display: flex;
  flex-flow: row wrap;
  align-items: center;
  justify-content: flex-start;

  .select-container {
    margin-right: 16px;
  }

  /deep/ label {
    margin-bottom: 0;
  }
}

/deep/ .btn-primary {
  background-color: $orange;
  border: none;
}

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

.info {
  color: $orange;
}
</style>
