<template>
  <div>
    <SectionTitle :num="numStep">{{ $t('getvsion.alarm-creation.defineThreshold') }}</SectionTitle>

    <div class="d-flex mb-2">
      <span :class="{ bold: !isAdvanced }">{{ $t('getvsion.alarm-creation.standardMode') }}</span>
      <UiToggle v-model="isAdvanced" on-text off-text />
      <span :class="{ bold: isAdvanced }">{{ $t('getvsion.alarm-creation.advancedMode') }}</span>
    </div>

    <div class="values-container" :class="{ 'standard-mode': !isAdvanced }">
      <div class="item">
        <span
          >{{ $t('getparc.lineDetail.alarms.callInOut') }} ({{
            $t('getparc.lineDetail.alarms.times')
          }})</span
        >
        <UiInput
          class="value-input"
          :input-style="inputStyle"
          input-type="number"
          v-model="voiceCallsThreshold"
          positive-number
        />
      </div>
      <div v-if="isAdvanced" class="item fade-in-reveal">
        <span
          >{{ $t('getparc.lineDetail.alarms.call_in') }} ({{
            $t('getparc.lineDetail.alarms.times')
          }})</span
        >
        <UiInput
          class="value-input"
          :input-style="inputStyle"
          input-type="number"
          v-model="voiceCallsInThreshold"
          positive-number
        />
      </div>
      <div v-if="isAdvanced" class="item fade-in-reveal">
        <span
          >{{ $t('getparc.lineDetail.alarms.call_out') }} ({{
            $t('getparc.lineDetail.alarms.times')
          }})</span
        >
        <UiInput
          class="value-input"
          :input-style="inputStyle"
          input-type="number"
          v-model="voiceCallsOutThreshold"
          positive-number
        />
      </div>
      <div class="item">
        <span
          >{{ $t('getparc.lineDetail.alarms.data_session') }} ({{
            $t('getparc.lineDetail.alarms.times')
          }})</span
        >
        <UiInput
          class="value-input"
          :input-style="inputStyle"
          input-type="number"
          v-model="pdpSessionsThreshold"
          positive-number
        />
      </div>
    </div>

    <div v-if="isAdvanced" class="mt-4 mb-2">
      <h6>{{ $t('getparc.lineDetail.alarms.observationCycle') }}</h6>
      <Toggle
        v-if="toggleValues"
        @update="currentPeriod = $event.id"
        :values="toggleValues"
        class="pl-2"
      />
    </div>

    <div v-if="isAdvanced && currentPeriod === 'CUSTOM'" class="custom-observation">
      <UiInput
        class="value-input"
        v-model="customPeriodValue"
        input-type="number"
        positive-number
      />
      <span>{{ $t('days') }}</span>
    </div>
  </div>
</template>

<script>
import UiInput from '@/components/ui/UiInput';
import SectionTitle from '@/components/SectionTitle';
import UiToggle from '@/components/ui/UiToggle';
import Toggle from '@/components/ui/UiToggle2';

export default {
  components: {
    UiInput,
    SectionTitle,
    UiToggle,
    Toggle,
  },

  props: {
    partner: Object,
    duplicateFrom: {
      type: Object,
      required: false,
    },
  },

  mounted() {
    if (this.duplicateFrom) {
      this.voiceCallsThreshold = this.duplicateFrom.voiceCallsThreshold;
      this.voiceCallsInThreshold = this.duplicateFrom.voiceCallsInThreshold;
      this.voiceCallsOutThreshold = this.duplicateFrom.voiceCallsOutThreshold;
      this.pdpSessionsThreshold = this.duplicateFrom.pdpSessionsThreshold;
      this.currentPeriod = this.duplicateFrom.observationCycle;
      this.toggleValues = this.toggleValues.map((t) => {
        t.default = t.id === this.duplicateFrom.observationCycle;
        return t;
      });
      if (this.currentPeriod === 'CUSTOM') {
        this.customPeriodValue = this.duplicateFrom.observationDelay;
      }
      if (this.currentPeriod !== 'MONTH') {
        this.isAdvanced = true;
      }
    }
  },

  data() {
    return {
      isAdvanced: false,
      voiceCallsThreshold: undefined,
      voiceCallsInThreshold: undefined,
      voiceCallsOutThreshold: undefined,
      pdpSessionsThreshold: undefined,
      currentPeriod: 'MONTHLY',
      customPeriodValue: undefined,
      toggleValues: [
        {
          id: 'DAILY',
          label: 'frequencies.DAILY',
        },
        {
          id: 'WEEKLY',
          label: 'frequencies.WEEKLY',
        },
        {
          id: 'MONTHLY',
          label: 'frequencies.MONTHLY',
          default: true,
        },
        {
          id: 'CUSTOM',
          label: 'frequencies.CUSTOM',
        },
      ],
      inputStyle: {
        padding: '0.3rem',
        fontSize: '0.8rem',
        height: '2.2rem',
      },
    };
  },

  computed: {
    editMode() {
      return this.duplicateFrom && this.duplicateFrom.toModify;
    },
    numStep() {
      if (!this.editMode && this.partner) {
        return 2;
      }
      return this.editMode ? 1 : 3;
    },
  },

  methods: {
    emitChange() {
      this.$emit('change', {
        voiceCallsThreshold: this.voiceCallsThreshold,
        voiceCallsInThreshold: this.voiceCallsInThreshold,
        voiceCallsOutThreshold: this.voiceCallsOutThreshold,
        pdpSessionsThreshold: this.pdpSessionsThreshold,
        currentPeriod: this.currentPeriod,
        customPeriodValue: this.customPeriodValue,
      });
    },
  },

  watch: {
    isAdvanced(newValue) {
      if (!newValue) {
        this.voiceCallsThreshold = undefined;
        this.voiceCallsInThreshold = undefined;
        this.voiceCallsOutThreshold = undefined;
        this.pdpSessionsThreshold = undefined;
        this.currentPeriod = undefined;
        this.customPeriodValue = undefined;
      }
    },

    voiceCallsThreshold() {
      this.emitChange();
    },
    voiceCallsInThreshold() {
      this.emitChange();
    },
    voiceCallsOutThreshold() {
      this.emitChange();
    },
    pdpSessionsThreshold() {
      this.emitChange();
    },
    currentPeriod() {
      this.emitChange();
    },
    customPeriodValue() {
      this.emitChange();
    },
  },
};
</script>

<style lang="scss" scoped>
.bold {
  font-weight: bold;
}
.values-container {
  display: flex;
  flex-wrap: wrap;
  border: 1px solid $medium-gray;
  padding: 0.5rem;
  border-radius: 0.2rem;

  width: 100%;

  &.standard-mode {
    width: 30%;
    flex-direction: column;
  }

  .item {
    flex-basis: 30%;
    display: flex;
    justify-content: flex-end;

    span {
      font-size: 0.9rem;
      top: 0.4rem;
      position: relative;
    }

    .value-input {
      padding-left: 1rem;
      padding-right: 1rem;
      flex-basis: 40%;
    }
  }
}

.custom-observation {
  display: flex;

  label {
    flex-basis: 7%;
  }
  span {
    font-size: 1rem;
    font-weight: bold;
    position: relative;
    top: 0.5rem;
    padding-left: 0.5rem;
  }
}
</style>
